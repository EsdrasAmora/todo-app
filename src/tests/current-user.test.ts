import { expect } from 'chai';
import { prisma } from '../db/client';
import { assertThrows } from './assert-helpers';
import { clearDatabase } from './clear-db';
import { createCaller, createUnauthorizedCaller, createUser } from './test-client';

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

  it('should error: unauthorized', async () => {
    const client = createUnauthorizedCaller();
    await assertThrows(client.user.me(), 'Missing authorization header');
  });

  it('should error: deleted user', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    await prisma.user.delete({ where: { id: userId } });

    await assertThrows(client.user.me(), 'Resource not found');
  });
});
