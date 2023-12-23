import { beforeEach, describe, expect } from 'vitest';

import { Database } from '../db/client';
import { assertThrows } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { authTest } from './test-client';

describe('Fetch Current user', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  authTest('should fetch current user successfully', async ({ auth: { client, user } }) => {
    const result = await client.user.me();
    expect(user).toMatchObject(result);
  });

  checkAuthenticatedRoute('user', 'me');

  authTest('should error: deleted user', async ({ auth: { client, user } }) => {
    await Database.deleteFrom('users').where('id', '=', user.id).executeTakeFirstOrThrow();
    await assertThrows(client.user.me(), 'Resource not found');
  });
});
