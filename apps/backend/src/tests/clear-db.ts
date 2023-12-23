import type { DB } from '@repo/db';

import { Sql } from '../db/client';

const buildDeleteStatement = (tablenames: string[]) => `TRUNCATE TABLE ${tablenames.join(', ')} CASCADE;`;

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
type KeysToSnakeCase<T> = CamelToSnakeCase<keyof T>;
type TableNames = KeysToSnakeCase<DB>;

export async function clearDatabase(tables: TableNames[] = ['users', 'todos']): Promise<void> {
  const query = buildDeleteStatement(tables);
  await Sql.unsafe(query).execute();
}
