import { randomUUID } from 'node:crypto';
import type { MiddlewareHandler } from 'hono';

import { contextSymbol, ReqStore } from '../../context';
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

    if (decodedToken) {
      return ReqStore.run(
        { ...baseContext, [contextSymbol]: 'AuthenticatedContext', userId: decodedToken.data.userId } as const,
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
