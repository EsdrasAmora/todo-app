import { expect } from 'chai';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUnauthorizedCaller, createUser } from './test-client';
import { assertThrows, assertValidationError } from './assert-helpers';
import { prisma } from '../db/client';
import { randomUUID } from 'crypto';

describe('Delete Todo', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should delete successfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const dbTodo = await createTodo(userId);

    await client.todo.delete({ todoId: dbTodo.id });

    const todo = await prisma.todo.findUnique({ where: { id: dbTodo.id, deletedAt: null } });
    expect(todo).to.be.null;
  });

  it('should error: unauthorized', async () => {
    const client = createUnauthorizedCaller();
    await assertThrows(client.todo.delete({ todoId: randomUUID() }), 'Missing authorization header');
  });

  it('should error: user should only be able to deleted its own todos', async () => {
    const otherUserTodo = await prisma.todo.create({
      data: { title: 'e', description: 'e', user: { create: { email: 'e', hashedPassword: 'e', passwordSalt: 'e' } } },
    });
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertThrows(client.todo.delete({ todoId: otherUserTodo.id }), 'Resource not found');
  });

  it('should error: todo not found', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertThrows(client.todo.delete({ todoId: randomUUID() }), 'Resource not found');
  });

  it('should error: todo soft deleted', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const dbTodo = await createTodo(userId);
    await prisma.todo.update({ where: { id: dbTodo.id }, data: { deletedAt: new Date() } });

    await assertThrows(client.todo.delete({ todoId: randomUUID() }), 'Resource not found');
  });

  it('should error: invalid uuid', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertValidationError(client.todo.delete({ todoId: '123' }), 'Invalid uuid');
  });
});
