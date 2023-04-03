import { expect } from 'chai';
import { prisma } from '../db/client';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUser } from './test-client';
import { checkAuthorizedRoute } from './auth-check';

describe('Delete User', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should delete successfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    await Promise.all([...Array(5)].map(() => createTodo(userId)));

    await client.user.delete();

    const todos = await prisma.todo.findMany({ where: { userId } });
    expect(todos).to.be.empty;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user).to.be.null;
  });

  checkAuthorizedRoute('user', 'delete');
});
