import { randomUUID } from 'node:crypto';
import { ReqStore, contextSymbol } from '../../context';
import { MiddlewareHandler } from 'hono';

export function asyncContext(): MiddlewareHandler {
  return (c, next) => {
    const ip = c.req.raw.headers
      .get('x-forwarded-for')
      ?.split(',')
      .map((v) => v.trimStart())[0];
    const uuid = c.req.header('X-Request-UUID') ?? randomUUID();
    c.res.headers.set('X-Request-UUID', uuid);

    return ReqStore.run(
      {
        [contextSymbol]: true,
        method: c.req.method,
        path: c.req.path,
        uuid,
        ip,
        authorization: c.req.header('authorization'),
        sessionId: c.req.header('x-session-uuid'),
        userAgent: c.req.header('user-agent'),
        //trpc method(s)?
      },
      () => {
        return next();
      },
    );
  };
}
