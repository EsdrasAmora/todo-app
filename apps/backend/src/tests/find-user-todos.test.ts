import { beforeEach, describe, expect, it } from 'vitest';

import { Database } from '../db/client';
import { isDefined } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUser } from './test-client';

describe('Find user todos', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  it('should find only the current user todos', async () => {
    const { id: userId } = await createUser();
    const { id: otherUserId } = await createUser();
    const client = createCaller(userId);
    const dbTodos = await Promise.all([...Array(5)].map(() => createTodo(userId)));
    await Promise.all([...Array(2)].map(() => createTodo(otherUserId)));

    const todos = await client.todo.findUserTodos();
    expect(dbTodos.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())).toMatchObject(todos);
  });

  checkAuthenticatedRoute('todo', 'findUserTodos');

  it('sould omit soft deleted todos', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    const [softDel1, softDel2, ...dbTodos] = await Promise.all([...Array(5)].map(() => createTodo(userId)));

    isDefined(softDel1);
    isDefined(softDel2);
    await Database.updateTable('todos')
      .set({ deletedAt: new Date() })
      .where('id', 'in', [softDel1.id, softDel2.id])
      .execute();

    const todos = await client.todo.findUserTodos();

    expect(todos).length(3);
    expect(dbTodos.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())).toMatchObject(todos);
  });
});
