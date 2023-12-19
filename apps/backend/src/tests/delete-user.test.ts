import { beforeEach, describe, expect, it } from 'vitest';

import { Database } from '../db/client';
import { checkAuthenticatedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUser } from './test-client';

describe('Delete User', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  it('should delete successfully', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    await Promise.all([...Array(5)].map(() => createTodo(userId)));

    await client.user.delete();

    const todos = await Database.selectFrom('todos').selectAll().where('userId', '=', userId).execute();
    expect(todos).to.be.empty;

    const user = await Database.selectFrom('users').selectAll().where('id', '=', userId).executeTakeFirst();
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
