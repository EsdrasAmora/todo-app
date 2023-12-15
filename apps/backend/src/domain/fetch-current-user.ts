import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { AuthenticatedContext } from '../context';
import { DbClient } from '../db/client';
import { UserEntity } from '../db/schema';

export class FetchCurrentUser {
  static schema = z.void();

  static async execute({ userId }: AuthenticatedContext) {
    const user = await DbClient.query.UserEntity.findFirst({ where: eq(UserEntity.id, userId) });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
    return user;
  }
}
