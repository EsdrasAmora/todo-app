import { expect } from 'chai';
import { prisma } from '../db/client';
import { assertThrows } from './assert-helpers';
import { clearDatabase } from './clear-db';
import { createCaller, createUser } from './test-client';
import { checkAuthorizedRoute } from './auth-check';

describe('Fetch Current user', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should fetch current user successfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    const user = await client.user.me();
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });

    expect(user).excluding(['hashedPassword', 'passwordSalt']).to.be.deep.eq(dbUser);
  });

  checkAuthorizedRoute('user', 'me');

  it('should error: deleted user', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    await prisma.user.delete({ where: { id: userId } });

    await assertThrows(client.user.me(), 'Resource not found');
  });
});
