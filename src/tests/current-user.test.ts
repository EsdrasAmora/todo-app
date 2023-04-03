import { expect } from 'chai';
import { prisma } from '../db/client';
import { assertThrows } from './assert-helpers';
import { clearDatabase } from './clear-db';
import { createCaller, createUnauthorizedCaller, createUser } from './test-client';

describe('Fetch Current user', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('Fetch Current user sucessfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    const user = await client.user.currentUser();
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });

    expect(user).excluding(['hashedPassword', 'passwordSalt']).to.be.deep.eq(dbUser);
  });

  it('Unauthorized', async () => {
    const client = createUnauthorizedCaller();
    await assertThrows(client.user.currentUser(), 'Missing authorization header');
  });

  it('Deleted user', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    await prisma.user.delete({ where: { id: userId } });

    await assertThrows(client.user.currentUser(), 'Resource not found');
  });
});
