import type { AuthenticatedContext } from '../context';

export class LogoutUser {
  static execute({ setCookie }: AuthenticatedContext) {
    // should we have a session on db?
    // delete cookie
    setCookie('authorization', '', 0);
  }
}
