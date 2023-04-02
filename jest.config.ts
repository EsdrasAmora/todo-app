import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  globalSetup: './src/tests/setup-test.ts',
  globalTeardown: './src/tests/teardown-test.ts',
};

export default config;
