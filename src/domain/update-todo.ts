import { z } from 'zod';
import { prisma } from '../db/client';
import { AuthorizedContext } from '../presentation/trpc.context';
import { handlePrismaError } from '../shared/handle-prisma-error';

export class UpdateTodo {
  static schema = z.object({
    todoId: z.string().uuid(),
    title: z.string().min(1).optional(),
    description: z.string().nullish(),
    completed: z.boolean().optional(),
  });

  static async execute({ todoId, ...data }: z.input<typeof this.schema>, { userId }: AuthorizedContext) {
    await prisma.$transaction(async (manager) => {
      const user = await manager.todo
        .update({
          where: { id: todoId },
          data,
        })
        .catch(handlePrismaError);
      if (user.id !== userId) {
        throw new Error(`Unauthorized: user '${userId}' does not own todo '${todoId}'`);
      }
    });
  }
}
