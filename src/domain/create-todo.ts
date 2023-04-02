import { z } from 'zod';
import { prisma } from '../db/client';
import { AuthorizedContext } from '../presentation/trpc.context';

export class CreateTodo {
  static schema = z.object({
    title: z.string().min(1),
    description: z.string().nullish(),
  });

  static execute(input: z.input<typeof this.schema>, { userId }: AuthorizedContext) {
    return prisma.todo.create({ data: { ...input, userId } });
  }
}
