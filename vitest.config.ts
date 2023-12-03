import { defineConfig } from 'vitest/dist/config.js';

export default defineConfig({
  test: {
    threads: false,
    globals: true,
    isolate: false,
    globalSetup: ['./src/test-setup.ts'],
    setupFiles: ['./src/test-perfile-setup.ts'],
    teardownTimeout: 5000,
  },
});
