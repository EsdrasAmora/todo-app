import { sql } from 'kysely';

import type { DB } from '@repo/db';

import { Database } from '../db';

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
type KeysToSnakeCase<T> = CamelToSnakeCase<keyof T>;
type TableNames = KeysToSnakeCase<DB>;

const buildDeleteStatement = (tablenames: string[]) => `TRUNCATE TABLE ${tablenames.join(', ')} CASCADE;`;

export async function clearDatabase(tables: TableNames[] = ['users', 'todos']): Promise<void> {
  const query = buildDeleteStatement(tables);
  await sql.raw(query).execute(Database);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
if (import.meta.url.endsWith(process.argv[1]!)) {
  await clearDatabase();
  await Database.destroy();
}
