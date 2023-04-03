import { z } from 'zod';
import { prisma } from '../db/client';
import { AuthorizedContext } from '../presentation/trpc.context';
import { handlePrismaError } from '../shared/handle-prisma-error';

export class FetchCurrentUser {
  static schema = z.void();

  static async execute({ userId }: AuthorizedContext) {
    return prisma.user.findUniqueOrThrow({ where: { id: userId } }).catch(handlePrismaError);
  }
}
