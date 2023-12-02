import { EnvSchemaValidation, EnvSchema } from './env-schema';
import { existsSync } from 'node:fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';

export const Env = { didSetup: false } as EnvSchema & { didSetup: boolean };

export async function setupEnv(filename: string) {
  const config = await parseEnvFile(filename);
  const validatedConfig = EnvSchemaValidation.parse(Object.assign(config, process.env));
  Object.assign(Env, validatedConfig, { didSetup: true });
}

async function parseEnvFile(filename: string) {
  const path = join(process.cwd(), filename);
  if (!existsSync(path)) {
    console.debug(`No .env file found at ${path}`);
    return {};
  }
  const file = await readFile(path);
  return dotenv.parse(file);
}
