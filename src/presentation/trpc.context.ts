import { initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { OpenApiMeta } from 'trpc-openapi';

export type Context = Awaited<ReturnType<typeof createTrpcContext>>;

export const createTrpcContext = async ({ req }: CreateExpressContextOptions) => {
  const userId = req.headers['TODO'] as string;
  return { userId };
};

export const trpc = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const authorizedProcedure = trpc.procedure.use(async ({ next }) => {
  const result = await next();
  if (!result.ok) {
    //check auth header
    // logger.error({ error: result.error, layer: 'Api', method: 'restProcedure' });
  }
  return result;
});

export const publicProcedure = trpc.procedure;
