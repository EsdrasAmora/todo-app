import { EnvSchemaValidation } from './env-schema';

if (process.env.IS_RUNNIG_ON_CLOUD) {
  console.info('Fetching envs from ...');
  await Promise.resolve();
  console.info('envs fetched');
}

console.info('ENV initializing...');
export const Env = EnvSchemaValidation.parse(process.env);
console.info('ENV initialized.');
