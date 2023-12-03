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
import { timing, startTime, endTime } from 'hono/timing';
import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';
import { Sql } from '../db/client';
import { logger } from 'hono/logger';
import os from 'os';

export async function configApi() {
  const app = new Hono();

  app.use('*', cors({ origin: Env.CORS_ALLOW_ORIGIN }));
  app.use('*', timing({ crossOrigin: true }));
  app.use('*', logger());
  if (Env.NODE_ENV === 'production') {
    //TODO: fix doc
    //chekc if hono does trough multiple .use calls
    app.use('*', compress());
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
  app.get('/health-check', async (c) => {
    startTime(c, 'db call', 'SELECT 1');
    const dbTime = (await Sql`SELECT 1`)[0].now;
    //replace with Logger
    console.log({ dbTime });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    endTime(c, 'db call');
    return c.json({
      status: 'ok',
      loadavg: os.loadavg().toString(),
      sysUptime: os.uptime(),
      processUptime: process.uptime(),
      freemem: os.freemem() / (1024 * 1024),
      totalmem: os.totalmem() / (1024 * 1024),
      cpus: os.cpus().length,
      relase: os.release(),
      userInfo: os.userInfo(),
    });
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
