import { Env } from '../env';
import postgres from 'postgres';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';

export const Sql = postgres(Env.DATABASE_URL, { max: 10, idle_timeout: 30 });
export const DbClient = drizzle(Sql, { schema });
