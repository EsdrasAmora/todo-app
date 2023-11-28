import { z } from '@hono/zod-openapi';
import { AuthorizedContext } from '../presentation/trpc.context';
import { DbClient } from 'db/client';
import { UserEntity } from 'db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export class FetchCurrentUser {
  static schema = z.void();

  static async execute({ userId }: AuthorizedContext) {
    const user = await DbClient.query.UserEntity.findFirst({ where: eq(UserEntity.id, userId) });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
    return user;
  }
}
