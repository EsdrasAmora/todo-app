import { randomUUID } from 'node:crypto';
import { ReqStore, contextSymbol } from '../../context';
import { MiddlewareHandler } from 'hono';
import { JwtService } from '../../shared/jwt';

export function asyncContext(): MiddlewareHandler {
  return (c, next) => {
    const ip = c.req.raw.headers
      .get('x-forwarded-for')
      ?.split(',')
      .map((v) => v.trimStart())[0];
    const uuid = c.req.header('X-Request-UUID') ?? randomUUID();
    c.res.headers.set('X-Request-UUID', uuid);

    const baseContext = {
      [contextSymbol]: 'UnauthenticatedContext',
      method: c.req.method,
      path: c.req.path,
      uuid,
      ip,
      sessionId: c.req.header('x-session-uuid'),
      userAgent: c.req.header('user-agent'),
      //trpc method(s)?
    } as const;

    const authorization = c.req.header('authorization');
    const decodedToken = authorization ? JwtService.verify(authorization) : null;

    if (authorization && decodedToken) {
      return ReqStore.run(
        Object.assign(baseContext, {
          [contextSymbol]: 'AuthenticatedContext',
          authorization: authorization,
          userId: decodedToken.data.userId,
        } as const),
        () => {
          return next();
        },
      );
    }

    return ReqStore.run(baseContext, () => {
      return next();
    });
  };
}
