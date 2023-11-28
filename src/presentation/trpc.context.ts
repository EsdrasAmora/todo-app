import { TRPCError, initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';
import { JwtService } from '../shared/jwt';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export const contextSymbol = Symbol('context');
export const createTrpcContext = ({ req }: FetchCreateContextFnOptions) => {
  const authorization = req.headers.get('authorization');
  return { authorization, [contextSymbol]: true } as const;
};

export type AuthorizedContext = { userId: string; [contextSymbol]: true };
export type Context = ReturnType<typeof createTrpcContext>;

export const trpc = initTRPC.context<Context>().meta<OpenApiMeta>().create();
export const middleware = trpc.middleware;

export const publicProcedure = trpc.procedure;
export const authorizedProcedure = trpc.procedure.use(async ({ ctx, next }) => {
  if (!ctx.authorization) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing authorization header' });
  }
  const decodedToken = JwtService.verify(ctx.authorization);
  if (!decodedToken) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired authorization header' });
  }
  const result = await next({ ctx: { userId: decodedToken.data.userId } });
  return result;
});
