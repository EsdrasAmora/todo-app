import { defineConfig } from 'vitest/dist/config.js';

export default defineConfig({
  test: {
    threads: false,
    isolate: false,
    globalSetup: ['./src/tests/global-setup.ts'],
    setupFiles: ['./src/tests/perfile-setup.ts'],
    teardownTimeout: 5000,
  },
});
