import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import type { OpenApiMeta } from 'trpc-openapi';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import type { AuthenticatedContext, Context } from '../context';
import { ReqStore } from '../context';

export const createTrpcContext = (_: FetchCreateContextFnOptions): Context => {
  return ReqStore.get();
};

export const trpc = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError: error.cause && error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });
export const middleware = trpc.middleware;

export const publicProcedure = trpc.procedure;
export const authorizedProcedure = trpc.procedure.use(async ({ ctx, next }) => {
  if (ctx.__type !== 'AuthenticatedContext') {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing, invalid or expired authorization header' });
  }

  const notSureWhyItDoesNotGetInferredCorrectly: AuthenticatedContext = ctx;
  const result = await next({ ctx: notSureWhyItDoesNotGetInferredCorrectly });
  return result;
});
