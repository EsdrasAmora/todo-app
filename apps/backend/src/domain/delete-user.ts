import type { AuthenticatedContext } from '../context';
import { Database } from '../db/client';

export class DeleteUser {
  static execute({ userId }: AuthenticatedContext) {
    return Database.transaction().execute(async (trx) => {
      await trx.deleteFrom('todos').where('userId', '=', userId).execute();
      await trx.deleteFrom('users').where('id', '=', userId).execute();
    });
  }
}
