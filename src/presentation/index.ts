import pdefer from 'p-defer';
import { appRouter } from './router';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Env } from '../env';
import { Server } from 'http';
import { createTrpcContext } from './trpc.context';
import { swaggerUI } from '@hono/swagger-ui';
import { openApiJsonDoc } from './openapi';
import { createOpenApiFetchHandler } from './fetch-adapter';
import { cors } from 'hono/cors';
import { trpcServer } from './trpc-server';
import { timing, setMetric, startTime, endTime } from 'hono/timing';
import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';
import { Sql } from '../db/client';

export async function configApi() {
  const app = new Hono();

  app.use('*', cors({ origin: Env.CORS_ALLOW_ORIGIN }));
  app.use('*', timing());
  app.use('*', compress());
  if (Env.NODE_ENV === 'production') {
    app.use('*', secureHeaders());
  }

  app.use(
    '/trpc/*',
    trpcServer({
      router: appRouter,
    }),
  );

  app.get('/doc', (c) => c.text(openApiJsonDoc));
  app.get('/ui', swaggerUI({ url: '/doc' }));
  app.get('/helth-check', async (c) => {
    //TODO: add metrics like db latency
    setMetric(c, 'region', 'europe-west3');
    startTime(c, 'db call');
    console.log(await Sql`SELECT NOW()`);
    endTime(c, 'db call');
    return c.json({ status: 'ok' });
  });

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
  const serverListenPromise = pdefer<any>();

  const nodejsApp = serve(
    {
      fetch: app.fetch,
      port: Env.PORT,
      hostname: 'localhost',
      //try out this, check if hono works in this case
      // createServer,
    },
    serverListenPromise.resolve,
  ) as Server;

  nodejsApp.once('error', serverListenPromise.reject);
  await serverListenPromise.promise;

  return nodejsApp;
}
