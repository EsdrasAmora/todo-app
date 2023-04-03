import { expect } from 'chai';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUnauthorizedCaller, createUser } from './test-client';
import { assertThrows, assertValidationError } from './assert-helpers';
import { prisma } from '../db/client';
import { randomUUID } from 'crypto';

describe.only('Delete Todo', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('Delete sucessfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const dbTodo = await createTodo(userId);

    await client.todo.delete({ todoId: dbTodo.id });

    const todo = await prisma.todo.findUnique({ where: { id: dbTodo.id, deletedAt: null } });
    expect(todo).to.be.null;
  });

  it('Unauthorized', async () => {
    const client = createUnauthorizedCaller();
    await assertThrows(client.todo.delete({ todoId: randomUUID() }), 'Missing authorization header');
  });

  it('A user can only deleted its own todos', async () => {
    const otherUserTodo = await prisma.todo.create({
      data: { title: 'e', description: 'e', user: { create: { email: 'e', hashedPassword: 'e', passwordSalt: 'e' } } },
    });
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertThrows(client.todo.delete({ todoId: otherUserTodo.id }), 'Resource not found');
  });

  it('Not found', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertThrows(client.todo.delete({ todoId: randomUUID() }), 'Resource not found');
  });

  it('Already soft deleted', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const dbTodo = await createTodo(userId);
    await prisma.todo.update({ where: { id: dbTodo.id }, data: { deletedAt: new Date() } });

    await assertThrows(client.todo.delete({ todoId: randomUUID() }), 'Resource not found');
  });

  it('Invalid uuid', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertValidationError(client.todo.delete({ todoId: '123' }), 'Invalid uuid');
  });
});
