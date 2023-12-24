import { randomUUID } from 'crypto';
import { beforeEach, describe, expect } from 'vitest';

import { Database } from '../db';
import { assertThrows, assertValidationError } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { appTest, createTodo } from './test-client';

describe('Update Todo', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  appTest('should update a todo successfully', async ({ auth: { user, client } }) => {
    const dbTodo = await createTodo(user.id);

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
    expect(todo.createdAt.getTime()).to.be.eq(dbTodo.createdAt.getTime());
    expect(todo.updatedAt).to.be.greaterThan(dbTodo.updatedAt).and.to.be.greaterThan(todo.createdAt);

    const todoDb = await Database.selectFrom('todos').selectAll().where('id', '=', todo.id).executeTakeFirstOrThrow();
    expect(todoDb).toMatchObject(todo);
  });

  checkAuthenticatedRoute('todo', 'findUserTodos');

  appTest('should error: user should be only able to update its own todos', async ({ auth: { client } }) => {
    const otherUser = await Database.insertInto('users')
      .values({ passwordSeed: 'a', email: 'a', hashedPassword: 'a' })
      .returning('id')
      .executeTakeFirstOrThrow();
    const otherUserTodo = await Database.insertInto('todos')
      .values({ userId: otherUser.id, title: 'e' })
      .returning('id')
      .executeTakeFirstOrThrow();
    await assertThrows(client.todo.update({ todoId: otherUserTodo.id }), 'Resource not found');
  });

  appTest("should error: Todo doesn't exists", async ({ auth: { client } }) => {
    await assertThrows(client.todo.update({ todoId: randomUUID() }), 'Resource not found');
  });

  appTest('should error: already deleted todo', async ({ auth: { client, user } }) => {
    const dbTodo = await createTodo(user.id);
    await Database.updateTable('todos')
      .set({ deletedAt: new Date() })
      .where('id', '=', dbTodo.id)
      .executeTakeFirstOrThrow();
    await assertThrows(client.todo.delete({ todoId: dbTodo.id }), 'Resource not found');
  });

  appTest('should error: invalid uuid', async ({ auth: { client } }) => {
    await assertValidationError(client.todo.delete({ todoId: '123' }), 'Invalid uuid');
  });

  appTest('should error: empty title', async ({ auth: { client, user } }) => {
    const dbTodo = await createTodo(user.id);
    await assertValidationError(
      client.todo.update({ todoId: dbTodo.id, title: '' }),
      'String must contain at least 1 character(s)',
    );
  });
});
