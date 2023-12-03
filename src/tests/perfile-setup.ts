import { setupEnv, Env } from '../env';

// This function run for every test file, but we're running vitest with `noThreads` and `noIsolation`.
// So there's no need to run it after the first invocation
async function main() {
  if (Env.didSetup) {
    return;
  }
  console.debug('Loading env...');
  await setupEnv('test.env');
  console.debug('env loaded');
}

void main();
