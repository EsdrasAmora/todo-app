import { z } from 'zod';
import { prisma } from '../db/client';
import { handlePrismaError } from '../shared/handle-prisma-error';
import { AuthorizedContext } from '../presentation/trpc.context';

export class DeleteTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
  });

  static execute({ todoId }: z.input<typeof this.schema>, { userId }: AuthorizedContext) {
    return prisma.todo
      .update({ where: { id: todoId, userId, deletedAt: null }, data: { deletedAt: new Date() } })
      .catch(handlePrismaError);
  }
}
