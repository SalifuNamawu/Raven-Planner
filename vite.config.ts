import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

// PORT is only required when running the dev server or preview.
// During `vite build` (e.g. on Vercel) it is not needed.
const rawPort = process.env.PORT;
let port: number | undefined;

if (rawPort !== undefined) {
  const parsed = Number(rawPort);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }
  port = parsed;
}

// BASE_PATH defaults to '/' for production builds (e.g. Vercel).
// In Replit it is injected by the artifact runner.
const basePath = process.env.BASE_PATH ?? '/';

// API server port for the dev proxy. Defaults to 8080 (Replit workflow default).
const apiPort = process.env.API_PORT ?? '8080';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({ root: import.meta.dirname }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'attached_assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    ...(port !== undefined ? { port, strictPort: true } : {}),
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
    // Proxy /api/* to the local Express API server in development.
    // In production (Vercel) /api/* is handled by Vercel Functions natively.
    proxy: {
      '/api': {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
  preview: {
    ...(port !== undefined ? { port } : {}),
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
