import { z } from 'zod';
import { AuthorizedContext } from '../presentation/trpc.context';
import { DbClient } from 'db/client';
import { TodoEntity } from 'db/schema';

export class CreateTodo {
  static schema = z.object({
    title: z.string().min(1),
    description: z.string().nullish(),
  });

  static async execute(input: z.input<typeof this.schema>, { userId }: AuthorizedContext) {
    const [result] = await DbClient.insert(TodoEntity)
      .values({ ...input, userId })
      .returning();
    return result;
  }
}
