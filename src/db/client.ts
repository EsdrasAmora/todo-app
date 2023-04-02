import { PrismaClient } from '@prisma/client';
import { Env } from '../env';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = `${Env.DATABASE_URL}?connection_limit=${Env.DATABASE_CONNECTION_LIMIT}&pool_timeout=${Env.DATABASE_CONNECTION_POOL_TIMEOUT}`;
console.log({ databaseUrl });
export const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl } },
  log: ['warn'],
  errorFormat: 'minimal',
});

if (process.env.NODE_ENV !== 'production') {
  console.log('hi There');
  globalForPrisma.prisma = prisma;
}
