import { and, desc, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';

import type { AuthenticatedContext } from '../context';
import { DbClient } from '../db/client';
import { TodoEntity } from '../db/schema';

export class FindUserTodos {
  static schema = z.void();

  static execute({ userId }: AuthenticatedContext) {
    return DbClient.select()
      .from(TodoEntity)
      .where(and(eq(TodoEntity.userId, userId), isNull(TodoEntity.deletedAt)))
      .orderBy(desc(TodoEntity.updatedAt));
  }
}
