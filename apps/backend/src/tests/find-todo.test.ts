import { randomUUID } from 'crypto';
import { beforeEach, describe, expect } from 'vitest';

import { clearDatabase } from '../scripts/clear-db';
import { assertThrows } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { appTest, createTodo, createUser } from './test-client';

describe('Find user todos', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  appTest('should find user todo successfully', async ({ auth: { client, user } }) => {
    const dbTodo = await createTodo(user.id);
    const todo = await client.todo.findById({ todoId: dbTodo.id });
    expect(dbTodo).toMatchObject(todo);
  });

  checkAuthenticatedRoute('todo', 'findById');

  appTest('should error with not found if the user does not own the todo', async ({ auth: { client } }) => {
    const { id: otherUserId } = await createUser();
    const dbTodo = await createTodo(otherUserId);
    await assertThrows(client.todo.findById({ todoId: dbTodo.id }), 'Resource not found');
  });

  appTest('should error with not found if the todo does not exists', async ({ auth: { client } }) => {
    await assertThrows(client.todo.findById({ todoId: randomUUID() }), 'Resource not found');
  });
});
