import { z } from 'zod';
import { prisma } from '../db/client';

export class FindTodos {
  static schema = z.object({
    userId: z.string(),
  });

  static execute({ userId }: z.input<typeof this.schema>) {
    return prisma.todo.findMany({ where: { userId } });
  }
}
