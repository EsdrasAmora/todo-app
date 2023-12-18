import { eq } from 'drizzle-orm';

import type { AuthenticatedContext } from '../context';
import { DbClient } from '../db/client';
import { TodoEntity, UserEntity } from '../db/schema';

export class DeleteUser {
  static async execute({ userId }: AuthenticatedContext) {
    await DbClient.transaction((tx) => {
      return Promise.all([
        tx.delete(TodoEntity).where(eq(TodoEntity.userId, userId)),
        tx.delete(UserEntity).where(eq(UserEntity.id, userId)),
      ]);
    });
  }
}
