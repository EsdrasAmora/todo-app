import { prisma } from '../db/client';
import { PrismaClient } from '@prisma/client';

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;

type IgnorePrismaBuiltins<S extends string> = string extends S
  ? string
  : S extends ''
  ? S
  : S extends `$${infer _T}`
  ? never
  : S;

export type PrismaTableNames = CamelToSnakeCase<IgnorePrismaBuiltins<Exclude<keyof PrismaClient, symbol>>>;

let cachedTableNames: string[] = [];

const allTables = async (): Promise<void> => {
  if (!cachedTableNames.length) {
    const data = await prisma.$queryRaw<
      { tablename: string }[]
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    cachedTableNames = data.map(({ tablename }) => tablename).filter((tableName) => tableName !== '_prisma_migrations');
  }
};

const buildDeleteStatement = (tablenames: string[]) =>
  `TRUNCATE TABLE ${tablenames.map(parseTableName).join(', ')} CASCADE;`;

const parseTableName = (tablename: string) => `"public"."${tablename}"`;

/**
 * Truncate database tables.
 * @param tablesToTruncate - Tables to truncate. If not provided, all tables will be truncated.
 **/
export async function clearDatabase(tablesToTruncate?: PrismaTableNames[]): Promise<void> {
  if (cachedTableNames.length === 0) {
    await allTables();
  }

  const tables = tablesToTruncate ?? cachedTableNames;
  await prisma.$executeRawUnsafe(buildDeleteStatement(tables));
}
