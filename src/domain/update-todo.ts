import { TodoEntity } from 'db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { z } from '@hono/zod-openapi';
import { DbClient } from '../db/client';
import { AuthorizedContext } from '../presentation/trpc.context';
import { throwOnNotFound } from 'shared/errors';

export class UpdateTodo {
  static schema = z.object({
    // todoId: z.string().uuid(),
    title: z.string().min(1).optional(),
    description: z.string().nullish(),
    completed: z.boolean().optional(),
  });

  @throwOnNotFound
  static async execute(todoId: string, data: z.input<typeof this.schema>, { userId }: AuthorizedContext) {
    const [result] = await DbClient.update(TodoEntity)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(and(eq(TodoEntity.id, todoId), eq(TodoEntity.userId, userId), isNull(TodoEntity.deletedAt)))
      .returning();
    return result;
  }
}
