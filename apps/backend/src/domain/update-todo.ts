import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { AuthenticatedContext } from '../context';
import { Database } from '../db';

export class UpdateTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
    title: z.string().min(1).optional(),
    description: z.string().nullish(),
    completed: z.boolean().optional(),
  });

  static async execute({ todoId, ...data }: z.input<typeof this.schema>, { userId }: AuthenticatedContext) {
    const result = await Database.updateTable('todos')
      .set({ ...data, updatedAt: new Date() })
      .where('id', '=', todoId)
      .where('userId', '=', userId)
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirst();
    if (!result) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
    return result;
  }
}
