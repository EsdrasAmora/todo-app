import { AsyncLocalStorage } from 'node:async_hooks';

export type AuthorizedContext = { userId: string; authorization: string; [contextSymbol]: true };
export type BaseContext = { authorization: string | null; [contextSymbol]: true };
export type Context = AuthorizedContext | BaseContext;
export const contextSymbol = Symbol('context');

export class ReqStore {
  private constructor() {}
  private static storage = new AsyncLocalStorage<Context>();

  static run<T>(context: BaseContext, callback: () => Promise<T>) {
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

  static getAuthorized(): AuthorizedContext {
    const store = this.get();
    if ('userId' in store) {
      return store;
    }
    throw new Error('Context not initialized');
  }

  static setAuthorized(userId: string): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.storage.getStore().userId = userId;
  }
}
