import { z } from 'zod';

import type { AuthenticatedContext } from '../context';
import { Database } from '../db/client';

export class FindUserTodos {
  static schema = z.void();

  static execute({ userId }: AuthenticatedContext) {
    return Database.selectFrom('todos')
      .selectAll()
      .where('userId', '=', userId)
      .where('deletedAt', 'is', null)
      .orderBy('updatedAt', 'desc')
      .execute();
  }
}
