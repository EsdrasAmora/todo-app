import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
};

export default config;
