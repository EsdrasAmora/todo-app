import { PrismaClient } from '@prisma/client';
import { Env } from '../env';

const databaseUrl = `${Env.DATABASE_URL}?connection_limit=${Env.DATABASE_CONNECTION_LIMIT}&pool_timeout=${Env.DATABASE_CONNECTION_POOL_TIMEOUT}`;

export const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl } },
  log: ['warn'],
  errorFormat: 'minimal',
});
