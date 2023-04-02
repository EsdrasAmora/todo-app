import { z } from 'zod';
import { prisma } from '../db/client';
import { handlePrismaError } from '../shared/handle-prisma-error';

export class DeleteTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
  });

  static execute({ todoId }: z.input<typeof this.schema>) {
    return prisma.todo.update({ where: { id: todoId }, data: { deletedAt: new Date() } }).catch(handlePrismaError);
  }
}
