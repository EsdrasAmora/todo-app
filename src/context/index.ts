import { AsyncLocalStorage } from 'node:async_hooks';

export type BaseContext = {
  uuid: string;
  method: string;
  path: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
};

export type UnauthenticatedContext = BaseContext & {
  [contextSymbol]: 'UnauthenticatedContext';
};
export type AuthenticatedContext = BaseContext & {
  [contextSymbol]: 'AuthenticatedContext';
  userId: string;
  authorization: string;
};
export type Context = AuthenticatedContext | UnauthenticatedContext;
export const contextSymbol = Symbol('context');

export class ReqStore {
  private constructor() {}
  private static storage = new AsyncLocalStorage<Context>();

  static run<T>(context: Context, callback: () => Promise<T>) {
    return this.storage.run(context, callback);
  }

  static getOptional() {
    return this.storage.getStore();
  }

  static get(): Context {
    const store = this.storage.getStore();
    if (!store) {
      throw new Error('Context not initialized');
    }
    return store;
  }

  static getAuthenticated(): AuthenticatedContext {
    const store = this.get();
    if (store[contextSymbol] !== 'AuthenticatedContext') {
      throw new Error('Context not initialized');
    }
    return store;
  }
}
