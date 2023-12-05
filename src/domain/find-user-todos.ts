import { z } from 'zod';
import { DbClient } from '../db/client';
import { AuthorizedContext } from '../context';
import { TodoEntity } from '../db/schema';
import { isNull, desc, and, eq } from 'drizzle-orm';

export class FindUserTodos {
  static schema = z.void();

  static execute({ userId }: AuthorizedContext) {
    return DbClient.select()
      .from(TodoEntity)
      .where(and(eq(TodoEntity.userId, userId), isNull(TodoEntity.deletedAt)))
      .orderBy(desc(TodoEntity.updatedAt));
  }
}
