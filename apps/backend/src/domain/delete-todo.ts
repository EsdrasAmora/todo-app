import { TRPCError } from '@trpc/server';
import { and, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';

import { AuthenticatedContext } from '../context';
import { DbClient } from '../db/client';
import { TodoEntity } from '../db/schema';

export class DeleteTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
  });

  static async execute({ todoId }: z.input<typeof this.schema>, { userId }: AuthenticatedContext) {
    const { count } = await DbClient.update(TodoEntity)
      .set({ deletedAt: new Date() })
      .where(and(eq(TodoEntity.id, todoId), eq(TodoEntity.userId, userId), isNull(TodoEntity.deletedAt)))
      .execute();
    if (count === 0) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
  }
}
