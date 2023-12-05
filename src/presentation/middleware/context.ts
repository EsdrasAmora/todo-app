import { ReqStore, contextSymbol } from '../../context';
import { MiddlewareHandler } from 'hono';

export function asyncContext(): MiddlewareHandler {
  return (c, next) => {
    return ReqStore.run({ authorization: c.req.header('authorization') ?? null, [contextSymbol]: true }, () => {
      return next();
    });
  };
}
