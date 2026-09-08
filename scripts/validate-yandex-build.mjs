import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const MAX_UNPACKED_BYTES = 100 * 1024 * 1024;
const SAFE_CLOUD_SAVE_BYTES = 195 * 1024;

const failures = [];
const notes = [];

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(absolute)));
    } else if (entry.isFile()) {
      files.push(absolute);
    }
  }

  return files;
};

const formatMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

try {
  const distStat = await stat(DIST);
  assert(distStat.isDirectory(), 'dist/ is not a directory.');
} catch {
  failures.push('dist/ does not exist. Run Vite build first.');
}

if (failures.length === 0) {
  const indexPath = path.join(DIST, 'index.html');
  let indexHtml = '';

  try {
    indexHtml = await readFile(indexPath, 'utf8');
  } catch {
    failures.push('dist/index.html is missing. Yandex ZIP requires index.html at archive root.');
  }

  if (indexHtml) {
    assert(indexHtml.includes('src="/sdk.js"'), 'dist/index.html must load the Yandex SDK from /sdk.js.');
    assert(!indexHtml.includes('yandex.ru/games/sdk/v2'), 'Legacy Yandex SDK loader is still present.');
    assert(!indexHtml.includes('fonts.googleapis.com'), 'External Google Fonts request is present in the production HTML.');
    assert(!indexHtml.includes('fonts.gstatic.com'), 'External Google Fonts asset host is present in the production HTML.');
  }

  const files = await walk(DIST);
  let totalBytes = 0;

  for (const file of files) {
    const relative = path.relative(DIST, file).split(path.sep).join('/');
    const fileStat = await stat(file);
    totalBytes += fileStat.size;

    assert(!/[\s\u0400-\u04FF]/u.test(relative), `Unsafe Yandex archive path: ${relative}`);
    assert(!relative.endsWith('.map'), `Source map should not ship in production: ${relative}`);
  }

  assert(totalBytes <= MAX_UNPACKED_BYTES, `Unpacked dist is ${formatMb(totalBytes)}; Yandex limit is 100 MB.`);
  notes.push(`dist size: ${formatMb(totalBytes)} (${files.length} files)`);
}

try {
  const configSource = await readFile(path.join(ROOT, 'src/config/gameConfig.ts'), 'utf8');
  assert(/enableAdminPanel:\s*false/.test(configSource), 'enableAdminPanel must be false for production release.');
  assert(/enableAnalytics:\s*false/.test(configSource), 'enableAnalytics must be false for production release.');
} catch {
  failures.push('Could not validate src/config/gameConfig.ts release flags.');
}

try {
  const sdkSource = await readFile(path.join(ROOT, 'src/utils/yandexSdk.ts'), 'utf8');
  assert(sdkSource.includes('CLOUD_SAVE_MIN_INTERVAL_MS'), 'Cloud save throttling is missing.');
  assert(sdkSource.includes('LoadingAPI?.ready'), 'LoadingAPI.ready integration is missing.');
  assert(sdkSource.includes("game_api_pause"), 'game_api_pause lifecycle integration is missing.');
  assert(sdkSource.includes("game_api_resume"), 'game_api_resume lifecycle integration is missing.');
  notes.push(`cloud save safe payload budget: ${(SAFE_CLOUD_SAVE_BYTES / 1024).toFixed(0)} KB`);
} catch {
  failures.push('Could not validate src/utils/yandexSdk.ts.');
}

if (failures.length > 0) {
  console.error('\n❌ Yandex Games release validation failed:\n');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log('\n✅ Yandex Games release validation passed.');
notes.forEach((note) => console.log(`  - ${note}`));
console.log('  - dist/index.html is at ZIP root');
console.log('  - SDK loader: /sdk.js');
console.log('  - production admin/analytics flags are disabled');
console.log('  - archive paths are ASCII/no-whitespace and source maps are disabled\n');
