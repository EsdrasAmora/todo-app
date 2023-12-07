import { Env } from '../env';
import postgres from 'postgres';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Log } from '../logger';

//TODO: Add timeouts `idle_in_transaction_session_timeout`, `statement_timeout`, `lock_timeout`
// Add a shared readonly transaction for pipelining
Log.debug('Starting DB...');
export const Sql = postgres(Env.DATABASE_URL, {
  max: Env.DATABASE_POOL_MAX_CONNECTIONS,
  idle_timeout: Env.DATABASE_POOL_IDLE_CONNECTION_TIMEOUT,
  connect_timeout: Env.DATABASE_POOL_ACQUIRE_CONNECTION_TIMEOUT,
});
const [{ now }] = await Sql`SELECT NOW()`;
Log.debug(`DB started, dbTime: ${now as Date}`);
export const DbClient = drizzle(Sql, { schema });
