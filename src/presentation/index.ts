import { appRouter } from './router';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Env } from '../env';
import { Server } from 'http';
import { createTrpcContext } from './trpc.context';
import { swaggerUI } from '@hono/swagger-ui';
import { openApiJsonDoc } from './openapi';
import { createOpenApiFetchHandler } from './fetch-adapter';
import { trpcServer } from './trpc-server';

export async function configApi() {
  const app = new Hono();

  app.use(
    '/trpc/*',
    trpcServer({
      router: appRouter,
    }),
  );

  app.get('/doc', (c) => c.text(openApiJsonDoc));
  app.get('/ui', swaggerUI({ url: '/doc' }));

  app.use('/api/*', async (c) => {
    const response = await createOpenApiFetchHandler({
      req: c.req.raw,
      createContext: createTrpcContext,
      endpoint: '/api',
      responseMeta: ({ errors, type }) => {
        if (!errors.length && type === 'mutation') {
          return { status: 201 };
        }
        return {};
      },
      router: appRouter,
    });
    return response;
  });

  //use when available: https://github.com/tc39/proposal-promise-with-resolvers
  let resolve = (_val?: any) => {};
  let reject = (_val?: any) => {};

  const serverListenPromise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const nodejsApp = serve(
    {
      fetch: app.fetch,
      port: Env.PORT,
      hostname: 'localhost',
    },
    (address) => {
      console.log(`Server running in port ${address.port}`);
      resolve();
    },
  ) as Server;

  nodejsApp.once('error', reject);
  await serverListenPromise;

  return nodejsApp;
}
