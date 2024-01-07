import { beforeEach, describe, expect } from 'vitest';

import { Database } from '../db';
import { clearDatabase } from '../scripts/clear-db';
import { assertThrows } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { appTest } from './test-client';

describe('Fetch Current user', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  appTest('should fetch current user successfully', async ({ auth: { client, user } }) => {
    const result = await client.user.me();
    expect(user).toMatchObject(result);
  });

  checkAuthenticatedRoute('user', 'me');

  appTest('should error: deleted user', async ({ auth: { client, user } }) => {
    await Database.deleteFrom('users').where('id', '=', user.id).executeTakeFirstOrThrow();
    await assertThrows(client.user.me(), 'Resource not found');
  });
});
