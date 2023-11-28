import type { MiddlewareHandler } from 'hono/types';
import { JwtService } from 'shared/jwt';

export const contextSymbol = Symbol('context');
export type AuthorizedContext = { userId: string; [contextSymbol]: true };

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header('authorization');
  if (!authorization) {
    return c.json({ code: 'UNAUTHORIZED', message: 'Missing authorization header' }, 401);
  }
  const decodedToken = JwtService.verify(authorization);
  if (!decodedToken) {
    return c.json({ code: 'UNAUTHORIZED', message: 'Invalid or expired authorization header' }, 401);
  }
  return next();
};
