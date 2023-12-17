import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    poolOptions: { threads: { singleThread: true, isolate: false } },
    //I've seen no meaninfull changes with the optimizer enabled
    deps: { optimizer: { ssr: { enabled: true } } },
    restoreMocks: true,
    globalSetup: ['./src/tests/global-setup.ts'],
    setupFiles: ['./src/tests/perfile-setup.ts'],
    teardownTimeout: 5000,
  },
});
