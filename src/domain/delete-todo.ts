import { z } from 'zod';
import { prisma } from '../db/client';

export class DeleteTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
  });

  static execute({ todoId }: z.input<typeof this.schema>) {
    return prisma.todo.delete({ where: { id: todoId } });
  }
}
