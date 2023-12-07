// This function run for every test file, but we're running vitest with `noThreads` and `noIsolation`.
// So there's no need to run it after the first invocation

import './import-test-env';
import '../env';
