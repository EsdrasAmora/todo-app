import { beforeEach, expect, describe, it } from 'vitest';
import { DbClient } from '../db/client';
import { checkAuthorizedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUser } from './test-client';
import { inArray } from 'drizzle-orm';
import { TodoEntity } from '../db/schema';

describe('Find user todos', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should find user successfully', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    const dbTodos = await Promise.all([...Array(5)].map(() => createTodo(userId)));

    const todos = await client.todo.findUserTodos();
    expect(dbTodos.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())).toMatchObject(todos);
  });

  checkAuthorizedRoute('todo', 'findUserTodos');

  it('sould omit soft deleted todos', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    const [softDel1, softDel2, ...dbTodos] = await Promise.all([...Array(5)].map(() => createTodo(userId)));

    await DbClient.update(TodoEntity)
      .set({ deletedAt: new Date() })
      .where(inArray(TodoEntity.id, [softDel1.id, softDel2.id]))
      .execute();

    const todos = await client.todo.findUserTodos();

    expect(todos).length(3);
    expect(dbTodos.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())).toMatchObject(todos);
  });
});
