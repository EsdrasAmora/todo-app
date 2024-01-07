import { randomUUID } from 'node:crypto';
import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';

import type { UnauthenticatedContext } from '../../context';
import { ReqStore } from '../../context';
import { JwtService } from '../../shared/jwt';

export function asyncContext(): MiddlewareHandler {
  return (c, next) => {
    const ip = c.req.raw.headers
      .get('x-forwarded-for')
      ?.split(',')
      .map((v) => v.trimStart())[0];
    const uuid = c.req.header('X-Request-UUID') ?? randomUUID();
    c.res.headers.set('X-Request-UUID', uuid);

    const baseContext: UnauthenticatedContext = {
      __type: 'UnauthenticatedContext',
      method: c.req.method,
      path: c.req.path,
      uuid,
      ip,
      sessionId: c.req.header('x-session-uuid'),
      userAgent: c.req.header('user-agent'),
      setCookie: (name: string, value: string, maxAge = defaultCookieMaxAge) => {
        //TODO: hono `setCookie` is not working, seting it mannually for now
        c.res.headers.set(
          'Set-Cookie',
          `${name}=${value}; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}; Path=/`,
        );
      },
      setHeader: c.res.headers.set,
      //trpc method(s)?
    } as const;

    const authorization = getCookie(c, 'authorization') ?? c.req.header('authorization');
    const decodedToken = authorization ? JwtService.verify(authorization) : null;

    if (decodedToken) {
      return ReqStore.run(
        { ...baseContext, __type: 'AuthenticatedContext', userId: decodedToken.data.userId } as const,
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

const defaultCookieMaxAge = 60 * 60 * 24 * 30;
