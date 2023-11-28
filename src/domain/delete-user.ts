import { TodoEntity, UserEntity } from '../db/schema';
import { DbClient } from '../db/client';
import { AuthorizedContext } from '../presentation/trpc.context';
import { eq } from 'drizzle-orm';

export class DeleteUser {
  static async execute({ userId }: AuthorizedContext) {
    await DbClient.transaction((tx) => {
      return Promise.all([
        tx.delete(TodoEntity).where(eq(TodoEntity.userId, userId)),
        tx.delete(UserEntity).where(eq(UserEntity.id, userId)),
      ]);
    });
  }
}
