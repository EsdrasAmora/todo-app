import { z } from 'zod';
import { prisma } from '../db/client';

export class CreateTodo {
  static schema = z.object({
    userId: z.string().uuid(),
    title: z.string(),
    description: z.string().nullish(),
  });

  static execute(input: z.input<typeof this.schema>) {
    return prisma.todo.create({ data: input });
  }
}
