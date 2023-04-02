import { TRPCError, initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { OpenApiMeta } from 'trpc-openapi';
import { JwtService } from '../jwt';

const contextSymbol = Symbol('context');
export type AuthorizedContext = { userId: string; [contextSymbol]: true };
export type Context = ReturnType<typeof createTrpcContext>;

export const createTrpcContext = ({ req }: CreateExpressContextOptions) => {
  const authorization = req.headers.authorization;
  return { authorization, [contextSymbol]: true } as const;
};

export const trpc = initTRPC.context<Context>().meta<OpenApiMeta>().create();
export const middleware = trpc.middleware;

const isAuthorized = middleware(async ({ ctx, next }) => {
  if (!ctx.authorization) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing authorization header' });
  }
  const decodedToken = JwtService.verify(ctx.authorization);
  if (!decodedToken) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired authorization header' });
  }

  const result = await next({ ctx: { userId: decodedToken.userId } });
  return result;
});

export const publicProcedure = trpc.procedure;
export const authorizedProcedure = trpc.procedure.use(isAuthorized);
