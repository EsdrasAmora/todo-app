import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { AuthenticatedContext } from '../context';
import { Database } from '../db/client';

export class FindTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
  });

  static async execute({ todoId }: z.input<typeof this.schema>, { userId }: AuthenticatedContext) {
    const result = await Database.selectFrom('todos')
      .selectAll()
      .where('id', '=', todoId)
      .where('userId', '=', userId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    if (!result) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
    return result;
  }
}
