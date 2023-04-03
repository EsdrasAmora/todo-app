import { expect } from 'chai';
import { prisma } from '../db/client';
import { checkAuthorizedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUser } from './test-client';

describe('Find user todos', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should find user successfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const dbTodos = await Promise.all([...Array(5)].map(() => createTodo(userId)));

    const todos = await client.todo.findUserTodos();
    expect(todos)
      .excludingEvery(['userId', 'deletedAt'])
      .to.be.deep.eq(dbTodos.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
  });

  checkAuthorizedRoute('todo', 'findUserTodos');

  it('sould omit soft deleted todos', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const [softDel1, softDel2, ...dbTodos] = await Promise.all([...Array(5)].map(() => createTodo(userId)));

    await prisma.todo.updateMany({
      where: { id: { in: [softDel1.id, softDel2.id] } },
      data: { deletedAt: new Date() },
    });

    const todos = await client.todo.findUserTodos();

    expect(todos).length(3);
    expect(todos)
      .excludingEvery(['userId', 'deletedAt'])
      .to.be.deep.eq(dbTodos.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
  });
});
