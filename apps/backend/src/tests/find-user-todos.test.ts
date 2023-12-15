import { inArray } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { DbClient } from '../db/client';
import { TodoEntity } from '../db/schema';
import { isDefined } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUser } from './test-client';

describe('Find user todos', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  it('should find user successfully', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    const dbTodos = await Promise.all([...Array(5)].map(() => createTodo(userId)));

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
    await DbClient.update(TodoEntity)
      .set({ deletedAt: new Date() })
      .where(inArray(TodoEntity.id, [softDel1.id, softDel2.id]))
      .execute();

    const todos = await client.todo.findUserTodos();

    expect(todos).length(3);
    expect(dbTodos.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())).toMatchObject(todos);
  });
});
