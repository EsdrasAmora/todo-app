import { beforeEach, describe, expect } from 'vitest';

import { Database } from '../db/client';
import { checkAuthenticatedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { authTest, createTodos } from './test-client';

describe('Delete User', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  authTest('should delete successfully', async ({ auth: { user, client } }) => {
    await createTodos(user.id, 5);

    await client.user.delete();

    const todos = await Database.selectFrom('todos').selectAll().where('userId', '=', user.id).execute();
    expect(todos).to.be.empty;
    const result = await Database.selectFrom('users').selectAll().where('id', '=', user.id).executeTakeFirst();
    expect(result).to.be.undefined;
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
