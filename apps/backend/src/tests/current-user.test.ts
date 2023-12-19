import { beforeEach, describe, expect, it } from 'vitest';

import { Database } from '../db/client';
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
    const dbUser = await Database.selectFrom('users').selectAll().where('id', '=', userId).executeTakeFirst();

    expect(dbUser).toMatchObject(user);
  });

  checkAuthenticatedRoute('user', 'me');

  it('should error: deleted user', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    await Database.deleteFrom('users').where('id', '=', userId).executeTakeFirstOrThrow();

    await assertThrows(client.user.me(), 'Resource not found');
  });
});
