import { CamelCasePlugin, Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';

import type { DB } from '@repo/db';

import { Env } from '../env';
import { Log } from '../logger';

//TODO: Add timeouts `idle_in_transaction_session_timeout`, `statement_timeout`, `lock_timeout`
// Add a shared readonly transaction for pipelining
Log.info('Starting DB...');
export const Sql = postgres(Env.DATABASE_URL, {
  max: Env.DATABASE_POOL_MAX_CONNECTIONS,
  idle_timeout: Env.DATABASE_POOL_IDLE_CONNECTION_TIMEOUT,
  connect_timeout: Env.DATABASE_POOL_ACQUIRE_CONNECTION_TIMEOUT,
});
export const Database = new Kysely<DB>({
  dialect: new PostgresJSDialect({ postgres: Sql }),
  plugins: [new CamelCasePlugin()],
});
const [date] = await Sql`SELECT NOW()`;
Log.info(`DB started, dbTime: ${(date?.now as Date).toISOString()}`);
