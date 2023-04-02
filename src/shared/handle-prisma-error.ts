import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export function handlePrismaError(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
  }
  throw err;
}
