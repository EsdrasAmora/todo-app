import { z } from 'zod';
import { prisma } from '../db/client';

export class DeleteUser {
  static schema = z.object({
    userId: z.string().uuid(),
  });

  static async execute({ userId }: z.input<typeof this.schema>) {
    await prisma.$transaction([
      prisma.todo.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
  }
}
