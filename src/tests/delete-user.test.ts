import { beforeEach, expect, describe, it } from 'vitest';
import { DbClient } from '../db/client';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUser } from './test-client';
import { checkAuthenticatedRoute } from './auth-check';
import { TodoEntity, UserEntity } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Delete User', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should delete successfully', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    await Promise.all([...Array(5)].map(() => createTodo(userId)));

    await client.user.delete();

    const todos = await DbClient.query.TodoEntity.findMany({ where: eq(TodoEntity.userId, userId) });
    expect(todos).to.be.empty;

    const user = await DbClient.query.UserEntity.findFirst({ where: eq(UserEntity.id, userId) });
    expect(user).to.be.undefined;
  });

  checkAuthenticatedRoute('user', 'delete');
});
