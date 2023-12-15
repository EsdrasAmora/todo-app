import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { DbClient } from '../db/client';
import { UserEntity } from '../db/schema';
import { assertThrows } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { createCaller, createUser } from './test-client';

describe('Fetch Current user', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  it('should fetch current user successfully', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);

    const user = await client.user.me();
    const dbUser = await DbClient.query.UserEntity.findFirst({ where: eq(UserEntity.id, userId) });

    expect(dbUser).toMatchObject(user);
  });

  checkAuthenticatedRoute('user', 'me');

  it('should error: deleted user', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    await DbClient.delete(UserEntity).where(eq(UserEntity.id, userId));

    await assertThrows(client.user.me(), 'Resource not found');
  });
});
