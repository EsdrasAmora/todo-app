import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { AuthenticatedContext } from '../context';
import { Database } from '../db';

export class DeleteTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
  });

  static async execute({ todoId }: z.input<typeof this.schema>, { userId }: AuthenticatedContext) {
    const result = await Database.updateTable('todos')
      .set({ deletedAt: new Date() })
      .where('id', '=', todoId)
      .where('userId', '=', userId)
      .where('deletedAt', 'is', null)
      .returning('id')
      .execute();
    if (result.length === 0) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
  }
}
