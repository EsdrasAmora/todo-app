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
import { appVersion, asyncContext } from './middleware';
import os from 'os';

export async function configApi() {
  const app = new Hono();

  const compression = compress();

  app.use(
    '*',
    async (c, next) => {
      if (c.req.path === '/ui') {
        // c.res.headers.append('Content-Type', 'text/html; charset=utf-8');
        return next();
      }

      // return next();
      await compression(c, next);

      c.res.headers.append('Content-Type', 'application/json');
    },
    cors({ origin: Env.CORS_ALLOW_ORIGIN }),
    timing({ crossOrigin: true }),
    logger(),
    appVersion(),
    secureHeaders(),
    asyncContext(),
  );

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
    // if (response.status === 404) {
    //   return next();
    // }
    return response;
  });

  // app.use('/api/rest/*', async (c, next) => {
  //   console.log('BEFORE');
  //   await next();
  //   console.log('AFTER');
  //   return c.text('hello', { status: 201 });
  // });
  //
  // app.get('/api/rest/teste', (c) => {
  //   console.log('AFTER TESTE');
  //   return c.text('wtf', { status: 200 });
  // });

  app.use(
    '/trpc/*',
    trpcServer({
      router: appRouter,
    }),
  );

  app.get('/docs', (c) => c.text(openApiJsonDoc));
  app.get('/ui', swaggerUI({ url: '/docs' }));
  app.get('/health-check', async (c) => {
    startTime(c, 'DB call', 'SELECT 1');
    const dbTime = (await Sql`SELECT 1`)[0].now;
    //TODO: replace with Logger
    console.log({ dbTime });
    endTime(c, 'DB call');
    return c.json({
      status: 'ok',
      loadavg: os.loadavg().toString(),
      sysUptime: os.uptime(),
      processUptime: process.uptime(),
      freemem: os.freemem() / (1024 * 1024),
      totalmem: os.totalmem() / (1024 * 1024),
      memory: process.memoryUsage(),
      cpus: os.cpus().length,
      relase: os.release(),
      userInfo: os.userInfo(),
    });
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
