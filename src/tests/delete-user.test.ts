import { beforeEach, expect, describe, it } from 'vitest';
import { DbClient } from '../db/client';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUser } from './test-client';
import { checkAuthenticatedRoute } from './auth-check';
import { TodoEntity, UserEntity } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Delete User', () => {
  beforeEach(() => {
    return clearDatabase();
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

  //TODO: remove latter
  //
  // it('Mock example', async () => {
  //   const mySpy = vi.spyOn(DeleteUser, 'execute').mockImplementation(async (_a) => {
  //     console.log('my mocked method');
  //     await Promise.resolve();
  //   });
  //
  //   const { id: userId } = await createUser();
  //   const client = createCaller(userId);
  //   await Promise.all([...Array(5)].map(() => createTodo(userId)));
  //
  //   await client.user.delete();
  //   expect(mySpy).toHaveBeenCalledTimes(1);
  //
  //   mySpy.mockRestore(); // or vi.restoreAllMocks() on beforeEach
  // });

  checkAuthenticatedRoute('user', 'delete');
});
