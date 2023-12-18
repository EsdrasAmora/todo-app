import { EnvSchemaValidation } from './env-schema';

if (process.env.IS_RUNNIG_ON_CLOUD) {
  console.info('Fetching envs from ...');
  await Promise.resolve();
  console.info('envs fetched');
}

if (process.env.VITEST) {
  console.info('Importing test.env');
  const { join } = await import('path');
  const { parse } = await import('dotenv');
  const { readFile } = await import('node:fs/promises');
  const path = join(process.cwd(), 'test.env');
  const file = await readFile(path);
  Object.assign(process.env, parse(file));
}

console.info('ENV initializing...');
export const Env = EnvSchemaValidation.parse(process.env);
console.info('ENV initialized.');
