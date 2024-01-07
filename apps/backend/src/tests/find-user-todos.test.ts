import { beforeEach, describe, expect } from 'vitest';

import { Database } from '../db';
import { clearDatabase } from '../scripts/clear-db';
import { isDefined } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { appTest, createTodos, createUser } from './test-client';

describe('Find user todos', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  appTest('should find only the current user todos', async ({ auth: { user, client } }) => {
    const { id: otherUserId } = await createUser();
    const dbTodos = await createTodos(user.id, 5);
    await createTodos(otherUserId, 2);

    const todos = await client.todo.findUserTodos();
    expect(todos).length(5);
    expect(dbTodos.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())).toMatchObject(todos);
  });

  checkAuthenticatedRoute('todo', 'findUserTodos');

  appTest('sould omit soft deleted todos', async ({ auth: { client, user } }) => {
    const [softDel1, softDel2, ...dbTodos] = await createTodos(user.id, 5);

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
