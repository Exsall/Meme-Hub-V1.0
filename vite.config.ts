import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Yandex Games serves the uploaded ZIP from a nested path. Relative build
    // assets keep the bundle portable in Yandex preview, production, and local preview.
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'es2020',
      sourcemap: false,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Yandex recommends proxying /sdk.js during local development instead of
      // downloading or committing the SDK file into the project.
      proxy: {
        '/sdk.js': {
          target: 'https://sdk.games.s3.yandex.net',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
