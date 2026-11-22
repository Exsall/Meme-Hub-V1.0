import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const MAX_UNPACKED_BYTES = 300 * 1024 * 1024;
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
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (entry.isFile()) files.push(absolute);
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
  let indexHtml = '';
  try {
    indexHtml = await readFile(path.join(DIST, 'index.html'), 'utf8');
  } catch {
    failures.push('dist/index.html is missing. Playgama ZIP requires index.html at archive root.');
  }

  if (indexHtml) {
    assert(
      indexHtml.includes('https://bridge.playgama.com/v2/stable/playgama-bridge.js'),
      'dist/index.html must load Playgama Bridge v2 stable CDN script.',
    );
    assert(
      indexHtml.includes('window.playgamaBridgePromise'),
      'dist/index.html must expose the Playgama bootstrap promise.',
    );
    assert(
      indexHtml.includes('window.bridge') && indexHtml.includes('.initialize()'),
      'dist/index.html must initialize Playgama Bridge.',
    );
    assert(!indexHtml.includes('src="/sdk.js"'), 'Legacy portal /sdk.js loader is still present.');
    assert(!indexHtml.includes('YaGames'), 'Yandex YaGames bootstrap is still present.');
    assert(!indexHtml.includes('yandexSdkPromise'), 'Yandex SDK bootstrap promise is still present.');
    assert(!indexHtml.includes('fonts.googleapis.com'), 'External Google Fonts request is present.');
    assert(!indexHtml.includes('fonts.gstatic.com'), 'External Google Fonts host is present.');
    assert(indexHtml.includes('<html lang="en">'), 'English must be the default document language.');
    assert(indexHtml.includes('meme_hub_language'), 'Language preference bootstrap is missing from index.html.');
  }

  try {
    const rawConfig = await readFile(path.join(DIST, 'playgama-bridge-config.json'), 'utf8');
    const config = JSON.parse(rawConfig);
    assert(
      config.$schema === 'https://bridge.playgama.com/v2/stable/schema.json',
      'Playgama config must use the v2 stable schema.',
    );
    assert(config.advertisement?.rewarded, 'Playgama rewarded-ad config is missing.');
    assert(config.advertisement?.interstitial, 'Playgama interstitial-ad config is missing.');
    assert(
      Boolean(config.advertisement?.rewarded?.preloadOnStart),
      'Rewarded ad should be preloaded on start.',
    );
    assert(
      Boolean(config.advertisement?.interstitial?.preloadOnStart),
      'Interstitial ad should be preloaded on start.',
    );
    assert(
      config.advertisement?.useBuiltInErrorPopup === true,
      'Playgama built-in advertisement error popup must be enabled.',
    );
    assert(
      !config.platforms?.yandex,
      'Direct Yandex platform configuration must not be present in the V2 Playgama build.',
    );
  } catch (error) {
    failures.push(`dist/playgama-bridge-config.json is missing or invalid: ${String(error)}`);
  }

  const files = await walk(DIST);
  let totalBytes = 0;
  for (const file of files) {
    const relative = path.relative(DIST, file).split(path.sep).join('/');
    const fileStat = await stat(file);
    totalBytes += fileStat.size;

    assert(!/[\s\u0400-\u04FF]/u.test(relative), `Unsafe archive path: ${relative}`);
    assert(!relative.endsWith('.map'), `Source map should not ship in production: ${relative}`);
  }

  assert(
    totalBytes <= MAX_UNPACKED_BYTES,
    `Unpacked dist is ${formatMb(totalBytes)}; Playgama limit is 300 MB.`,
  );
  notes.push(`dist size: ${formatMb(totalBytes)} (${files.length} files)`);
}

try {
  const i18nSource = await readFile(path.join(ROOT, 'src/utils/i18n.ts'), 'utf8');
  assert(i18nSource.includes("export type GameLanguage = 'en' | 'ru'"), 'RU/EN language types are missing.');
  assert(i18nSource.includes("return saved === 'ru' ? 'ru' : 'en'"), 'English must be the default language.');
  assert(i18nSource.includes('startDomLocalization'), 'Runtime localization observer is missing.');
  assert(i18nSource.includes('if (translated !== value) element.setAttribute'), 'Translation attributes must not trigger an endless mutation loop.');
  assert(i18nSource.includes('if (translated !== value) node.nodeValue'), 'Translation text must not trigger an endless mutation loop.');
  assert(i18nSource.includes('if (translated !== value) current.nodeValue'), 'Nested translation text must not trigger an endless mutation loop.');
  assert(i18nSource.includes('observer.observe(root,'), 'Localization must not mutate SDK overlays.');
  assert(i18nSource.includes('meme_hub_language'), 'Persistent language storage key is missing.');
} catch {
  failures.push('Could not validate src/utils/i18n.ts.');
}

try {
  const settingsSource = await readFile(path.join(ROOT, 'src/components/SettingsModal.tsx'), 'utf8');
  assert(settingsSource.includes("setLanguage('en')"), 'English language button is missing from Settings.');
  assert(settingsSource.includes("setLanguage('ru')"), 'Russian language button is missing from Settings.');
} catch {
  failures.push('Could not validate Settings language controls.');
}

try {
  const configSource = await readFile(path.join(ROOT, 'src/config/gameConfig.ts'), 'utf8');
  assert(/enableAdminPanel:\s*false/.test(configSource), 'enableAdminPanel must be false for release.');
  assert(/enableAnalytics:\s*false/.test(configSource), 'enableAnalytics must be false for release.');
  assert(/version:\s*'V 2\.0'/.test(configSource), 'Game config version must be V 2.0.');
} catch {
  failures.push('Could not validate src/config/gameConfig.ts.');
}

try {
  const sdkSource = await readFile(path.join(ROOT, 'src/utils/playgamaSdk.ts'), 'utf8');
  [
    'rewarded_state_changed',
    'interstitial_state_changed',
    'game_ready',
    'gameplay_started',
    'gameplay_stopped',
    'pause_state_changed',
    'audio_state_changed',
    'storage.get',
    'storage.set',
  ].forEach((token) => assert(sdkSource.includes(token), `Playgama integration is missing: ${token}`));
  assert(
    sdkSource.includes("state === 'rewarded'"),
    'Rewarded grants must depend on the Playgama rewarded state.',
  );
} catch {
  failures.push('Could not validate src/utils/playgamaSdk.ts.');
}

try {
  await access(path.join(ROOT, 'src/utils/yandexSdk.ts'));
  failures.push('src/utils/yandexSdk.ts still exists and must be removed from V2.0.');
} catch {
  notes.push('legacy Yandex SDK wrapper removed');
}

if (failures.length > 0) {
  console.error('\n❌ Playgama release validation failed:\n');
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log('\n✅ Playgama release validation passed.');
notes.forEach((note) => console.log(`  - ${note}`));
console.log('  - index.html is at ZIP root');
console.log('  - Playgama Bridge v2 stable bootstrap is present');
console.log('  - Playgama storage, lifecycle, rewarded and interstitial integrations are present');
console.log('  - legacy Yandex SDK integration is absent');
console.log('  - English is default; Russian can be selected in Settings and persists locally');
console.log('  - production admin/analytics flags are disabled');
console.log('  - archive paths are Latin/no-whitespace and source maps are disabled\n');
