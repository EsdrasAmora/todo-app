import { TRPCError, initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { AuthenticatedContext, Context, ReqStore, contextSymbol } from '../context';

export const createTrpcContext = (_: FetchCreateContextFnOptions): Context => {
  return ReqStore.get();
};

export const trpc = initTRPC.context<Context>().meta<OpenApiMeta>().create();
export const middleware = trpc.middleware;

export const publicProcedure = trpc.procedure;
export const authorizedProcedure = trpc.procedure.use(async ({ ctx, next }) => {
  if (ctx[contextSymbol] !== 'AuthenticatedContext') {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing, invalid or expired authorization header' });
  }

  const notSureWhyItDoesNotGetInferredCorrectly: AuthenticatedContext = ctx;
  const result = await next({ ctx: notSureWhyItDoesNotGetInferredCorrectly });
  return result;
});