import { z } from 'zod';

import type { AuthenticatedContext } from '../context';
import { Database } from '../db/client';

export class CreateTodo {
  static schema = z.object({
    title: z.string().min(1),
    description: z.string().nullish(),
  });

  static execute(input: z.input<typeof this.schema>, { userId }: AuthenticatedContext) {
    return Database.insertInto('todos')
      .values({ ...input, userId })
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
