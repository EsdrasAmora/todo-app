import { expect } from 'chai';
import { prisma } from '../db/client';
import { assertThrows } from './assert-helpers';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUnauthorizedCaller, createUser } from './test-client';

describe('Delete User', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('Delete sucessfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    await Promise.all([...Array(5)].map(() => createTodo(userId)));

    await client.user.delete();

    const todos = await prisma.todo.findMany({ where: { userId } });
    expect(todos).to.be.empty;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user).to.be.null;
  });

  it('Unauthorized', async () => {
    const client = createUnauthorizedCaller();
    await assertThrows(client.user.delete(), 'Missing authorization header');
  });
});
