import { defineProject as _, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    poolOptions: { threads: { singleThread: true, isolate: false } },
    //I've seen no meaninfull changes with the optimizer enabled
    deps: { optimizer: { ssr: { enabled: true } } },
    restoreMocks: true,
    globalSetup: ['./src/tests/global-setup.ts'],
    setupFiles: ['./src/tests/perfile-setup.ts'],
    teardownTimeout: 5000,
    coverage: {
      provider: 'v8',
      // all: true,
      // skipFull: true,
      reporter: ['text', 'json', 'html'],
      exclude: ['src/tests'],
    },
  },
});
