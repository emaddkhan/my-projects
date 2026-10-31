import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const DEV_PORT = 5173;

/**
 * Content-Security-Policy injected into index.html.
 * Production is strict: only bundled local scripts, no network access.
 * Development additionally allows the React Refresh inline preamble and the
 * Vite HMR websocket on localhost.
 */
const CSP_PRODUCTION = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'",
].join('; ');

const CSP_DEVELOPMENT = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self' ws://localhost:${DEV_PORT} http://localhost:${DEV_PORT}`,
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'",
].join('; ');

function contentSecurityPolicy() {
  let isBuild = false;
  return {
    name: 'pos-content-security-policy',
    configResolved(config) {
      isBuild = config.command === 'build';
    },
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: isBuild ? CSP_PRODUCTION : CSP_DEVELOPMENT,
          },
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

export default defineConfig({
  // Relative asset paths so the built index.html works from file:// inside Electron.
  base: './',
  plugins: [react(), tailwindcss(), contentSecurityPolicy()],
  server: {
    host: 'localhost',
    port: DEV_PORT,
    strictPort: true,
    watch: {
      ignored: ['**/electron/**', '**/release/**', '**/scripts/**'],
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'chrome120',
    sourcemap: false,
  },
});
