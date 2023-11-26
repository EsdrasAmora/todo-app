import { expect } from 'chai';
import { DbClient } from '../db/client';
import { assertThrows } from './assert-helpers';
import { clearDatabase } from './clear-db';
import { createCaller, createUser } from './test-client';
import { checkAuthorizedRoute } from './auth-check';
import { eq } from 'drizzle-orm';
import { UserEntity } from 'db/schema';

describe('Fetch Current user', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should fetch current user successfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    const user = await client.user.me();
    const dbUser = await DbClient.query.UserEntity.findFirst({ where: eq(UserEntity.id, userId) });

    expect(user).excluding(['hashedPassword', 'passwordSeed']).to.be.deep.eq(dbUser);
  });

  checkAuthorizedRoute('user', 'me');

  it('should error: deleted user', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    await DbClient.delete(UserEntity).where(eq(UserEntity.id, userId));

    await assertThrows(client.user.me(), 'Resource not found');
  });
});
