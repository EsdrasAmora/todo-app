import { prisma } from '../db/client';
import { AuthorizedContext } from '../presentation/trpc.context';

export class DeleteUser {
  static async execute({ userId }: AuthorizedContext) {
    await prisma.$transaction([
      prisma.todo.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
  }
}
