import { TRPCError } from '@trpc/server';
import { and, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';

import type { AuthenticatedContext } from '../context';
import { DbClient } from '../db/client';
import { TodoEntity } from '../db/schema';

export class UpdateTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
    title: z.string().min(1).optional(),
    description: z.string().nullish(),
    completed: z.boolean().optional(),
  });

  static async execute({ todoId, ...data }: z.input<typeof this.schema>, { userId }: AuthenticatedContext) {
    const [result] = await DbClient.update(TodoEntity)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(TodoEntity.id, todoId), eq(TodoEntity.userId, userId), isNull(TodoEntity.deletedAt)))
      .returning();
    if (!result) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
    return result;
  }
}
