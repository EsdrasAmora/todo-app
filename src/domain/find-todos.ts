import { z } from 'zod';
import { prisma } from '../db/client';
import { AuthorizedContext } from '../presentation/trpc.context';

export class FindUserTodos {
  static schema = z.void();

  static execute({ userId }: AuthorizedContext) {
    return prisma.todo.findMany({ where: { userId, deletedAt: null }, orderBy: { updatedAt: 'desc' } });
  }
}
