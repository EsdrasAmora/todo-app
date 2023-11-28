import { z } from 'zod';
import { DbClient } from '../db/client';
import { AuthorizedContext } from '../presentation/trpc.context';
import { and, eq, isNull } from 'drizzle-orm';
import { TodoEntity } from '../db/schema';
import { TRPCError } from '@trpc/server';

export class FindTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
  });

  static async execute({ todoId }: z.input<typeof this.schema>, { userId }: AuthorizedContext) {
    const result = await DbClient.query.TodoEntity.findFirst({
      where: and(eq(TodoEntity.id, todoId), eq(TodoEntity.userId, userId), isNull(TodoEntity.deletedAt)),
    });
    if (!result) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
    return result;
  }
}
