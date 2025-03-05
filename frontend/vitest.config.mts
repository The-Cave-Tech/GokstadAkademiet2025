// vitest.config.mts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts', // Oppdatert fra ./src/tests/setup.ts
    globals: true,
    include: ['tests/**/*.test.{ts,tsx}'], // Matcher tests/ i roten
  },
});