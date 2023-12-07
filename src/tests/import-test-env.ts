import { existsSync } from 'node:fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';

console.info('Importing test.env');

const path = join(process.cwd(), 'test.env');
if (!existsSync(path)) {
  throw new Error(`No .env file found at ${path}`);
}
const file = await readFile(path);
Object.assign(process.env, dotenv.parse(file));
export {};
