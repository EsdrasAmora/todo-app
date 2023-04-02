import { expect } from 'chai';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUnauthorizedCaller, createUser } from './test-client';
import { assertThrows, assertValidationError } from './assert-helpers';
import { prisma } from '../db/client';
import { randomUUID } from 'crypto';

describe('Find Todo', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('Finds sucessfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const dbTodo = await createTodo(userId);

    const todo = await client.todo.findById({ todoId: dbTodo.id });

    expect(todo).excluding(['userId', 'deletedAt']).to.be.deep.eq(dbTodo);
  });

  it('Unauthorized', async () => {
    const client = createUnauthorizedCaller();
    await assertThrows(client.todo.findById({ todoId: randomUUID() }), 'Missing authorization header');
  });

  it('A user can only see its own todos', async () => {
    const otherUserTodo = await prisma.todo.create({
      data: { title: 'e', description: 'e', user: { create: { email: 'e', hashedPassword: 'e', passwordSalt: 'e' } } },
    });
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertThrows(client.todo.findById({ todoId: otherUserTodo.id }), 'Resource not found');
  });

  it('Not found', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertThrows(client.todo.findById({ todoId: randomUUID() }), 'Resource not found');
  });

  it('Soft deleted', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const dbTodo = await createTodo(userId);
    await prisma.todo.update({ where: { id: dbTodo.id }, data: { deletedAt: new Date() } });

    await assertThrows(client.todo.findById({ todoId: randomUUID() }), 'Resource not found');
  });

  it('Invalid uuid', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertValidationError(client.todo.findById({ todoId: '123' }), 'Invalid uuid');
  });
});
