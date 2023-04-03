import { expect } from 'chai';
import { randomUUID } from 'crypto';
import { prisma } from '../db/client';
import { assertThrows, assertValidationError } from './assert-helpers';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUnauthorizedCaller, createUser } from './test-client';

describe('Update Todo', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('Creates sucessfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const dbTodo = await createTodo(userId);

    const beforeUpdate = new Date();
    const todo = await client.todo.update({
      todoId: dbTodo.id,
      title: 'title',
      description: 'description',
      completed: true,
    });

    expect(todo.id).to.be.equal(dbTodo.id);
    expect(todo.description).to.be.equal('description');
    expect(todo.title).to.be.equal('title');
    expect(todo.completed).to.be.true;
    expect(todo.createdAt).to.be.lessThan(beforeUpdate);
    expect(todo.updatedAt).to.be.greaterThan(beforeUpdate);

    const todoDb = await prisma.todo.findUnique({ where: { id: todo.id } });
    expect(todoDb).excluding(['userId', 'deletedAt']).to.deep.equal(todo);
  });

  it('Unauthorized', async () => {
    const client = createUnauthorizedCaller();
    await assertThrows(client.todo.update({ todoId: randomUUID() }), 'Missing authorization header');
  });

  it('A user can only update its own todos', async () => {
    const otherUserTodo = await prisma.todo.create({
      data: {
        title: 'e',
        description: 'e',
        user: { create: { email: 'e', hashedPassword: 'e', passwordSalt: 'e' } },
      },
    });
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertThrows(client.todo.update({ todoId: otherUserTodo.id }), 'Resource not found');
  });

  it('Soft deleted', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const dbTodo = await createTodo(userId);
    await prisma.todo.update({ where: { id: dbTodo.id }, data: { deletedAt: new Date() } });

    await assertThrows(client.todo.delete({ todoId: dbTodo.id }), 'Resource not found');
  });

  it('Invalid uuid', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);

    await assertValidationError(client.todo.delete({ todoId: '123' }), 'Invalid uuid');
  });

  it('Empty Title', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const dbTodo = await createTodo(userId);
    await assertValidationError(
      client.todo.update({ todoId: dbTodo.id, title: '' }),
      'String must contain at least 1 character(s)',
    );
  });
});