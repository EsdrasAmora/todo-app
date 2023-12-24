import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { AuthenticatedContext } from '../context';
import { Database } from '../db';

export class FetchCurrentUser {
  static schema = z.void();

  static async execute({ userId }: AuthenticatedContext) {
    const user = await Database.selectFrom('users').selectAll().where('id', '=', userId).executeTakeFirst();
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
    return user;
  }
}
