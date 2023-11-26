import { Env } from '../env';
import postgres from 'postgres';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';

export const Sql = postgres(Env.DATABASE_URL, { max: 20 });
export const DbClient = drizzle(Sql, { schema });
