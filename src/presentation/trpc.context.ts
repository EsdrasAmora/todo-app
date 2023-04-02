import { TRPCError, initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { OpenApiMeta } from 'trpc-openapi';

const contextSymbol = Symbol('context');
export type AuthorizedContext = { userId: string; [contextSymbol]: 'context' };
export type Context = Awaited<ReturnType<typeof createTrpcContext>>;

export const createTrpcContext = async ({ req }: CreateExpressContextOptions) => {
  const userId = req.headers['TODO'];
  return { userId, [contextSymbol]: 'context' } as const;
};

export const trpc = initTRPC.context<Context>().meta<OpenApiMeta>().create();
export const middleware = trpc.middleware;

const isAuthorized = middleware(async ({ ctx, next }) => {
  if (!ctx.userId || typeof ctx.userId !== 'string') {
    //TODO: check auth header
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  const result = await next({ ctx: { userId: ctx.userId } });
  return result;
});

export const authorizedProcedure = trpc.procedure.use(isAuthorized);

export const publicProcedure = trpc.procedure;
