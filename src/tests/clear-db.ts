import { Sql } from '../db/client';

const buildDeleteStatement = (tablenames: string[]) =>
  `TRUNCATE TABLE ${tablenames.map(parseTableName).join(', ')} CASCADE;`;

const parseTableName = (tablename: string) => `"public"."${tablename}"`;

export async function clearDatabase(): Promise<void> {
  const tables = ['users', 'todos'];
  const query = buildDeleteStatement(tables);
  await Sql.unsafe(query).execute();
}
