import { z } from 'zod';
import { prisma } from '../db/client';
import { AuthorizedContext } from '../presentation/trpc.context';
import { handlePrismaError } from '../shared/handle-prisma-error';

export class FindTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
  });

  static execute({ todoId }: z.input<typeof this.schema>, { userId }: AuthorizedContext) {
    return prisma.todo.findUniqueOrThrow({ where: { id: todoId, deletedAt: null, userId } }).catch(handlePrismaError);
  }
}
