import { EnvSchemaValidation, EnvSchema } from './env-schema';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'path';
import dotenv from 'dotenv';

export const Env = {} as EnvSchema;

export function setupEnv(filename: string) {
  const config = parseEnvFile(filename);
  const validatedConfig = EnvSchemaValidation.parse(Object.assign(config, process.env));
  Object.assign(Env, validatedConfig);
}

function parseEnvFile(filename: string) {
  const path = join(process.cwd(), filename);
  if (!existsSync(path)) {
    console.debug(`No .env file found at ${path}`);
  }
  const file = readFileSync(path);
  return dotenv.parse(file);
}
