import { randomUUID } from 'crypto';
import { beforeEach, describe, expect, it } from 'vitest';

import { assertThrows } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUser } from './test-client';

describe('Find user todos', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  it('should find user todo successfully', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    const dbTodo = await createTodo(userId);
    const todo = await client.todo.findById({ todoId: dbTodo.id });
    expect(dbTodo).toMatchObject(todo);
  });

  checkAuthenticatedRoute('todo', 'findById');

  it('should error with not found if the user does not own the todo', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    const { id: otherUserId } = await createUser();
    const dbTodo = await createTodo(otherUserId);

    await assertThrows(client.todo.findById({ todoId: dbTodo.id }), 'Resource not found');
  });

  it('should error with not found if the todo does not exists', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);

    await assertThrows(client.todo.findById({ todoId: randomUUID() }), 'Resource not found');
  });
});
