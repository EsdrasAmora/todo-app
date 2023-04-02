import { z } from 'zod';
import { prisma } from '../db/client';
import { AuthorizedContext } from '../presentation/trpc.context';

export class FindUserTodos {
  //TODO: Add aditional filters, maybe return deleted todos
  static schema = z.object({});

  static execute({ userId }: AuthorizedContext) {
    return prisma.todo.findMany({ where: { userId, deletedAt: null } });
  }
}
