import { defineConfig } from 'vitest/dist/config.js';

export default defineConfig({
  test: {
    setupFiles: ['./src/test-setup.ts'],
  },
});
