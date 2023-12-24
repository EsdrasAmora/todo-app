import os from 'os';
import type { Server } from 'http';
import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { apiReference } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { endTime, startTime, timing } from 'hono/timing';
import pdefer from 'p-defer';

import { Sql } from '../db';
import { Env } from '../env';
import { Log } from '../logger';
import { createOpenApiFetchHandler } from './fetch-adapter';
import { appVersion, asyncContext } from './middleware';
import { openApiJsonDoc } from './openapi';
import { appRouter } from './router';
import { trpcServer } from './trpc-server';
import { createTrpcContext } from './trpc.context';

Log.info('Configuring API...');
const app = new Hono();

const compression = compress();

app.use(
  '*',
  async (c, next) => {
    if (c.req.path === '/ui' || c.req.path === '/swagger') {
      return next();
    }
    await compression(c, next);
    // this may should be somewhere else
    c.res.headers.append('Content-Type', 'application/json');
  },
  cors({ origin: Env.CORS_ALLOW_ORIGIN }),
  timing({ crossOrigin: true }),
  logger(),
  appVersion(),
  secureHeaders(),
  asyncContext(),
);

app.get('/', (c) => c.redirect('/ui'));
app.get('/docs.json', (c) => c.text(openApiJsonDoc));
app.get('/ui', apiReference({ spec: { url: '/docs.json' } }));
//Remove swagger if the Scalar is good enough
app.get('/swagger', swaggerUI({ url: '/docs.json' }));
app.use('/trpc/*', trpcServer({ router: appRouter }));
app.use('/api/*', (c) => {
  return createOpenApiFetchHandler({
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
});
app.get('/health-check', async (c) => {
  startTime(c, 'DB call', 'SELECT 1');
  const dbTime = (await Sql`SELECT 1`)[0]?.now;
  Log.info(dbTime);
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
const serverListenPromise = pdefer<unknown>();
export const NodeHttpServer = serve(
  {
    fetch: app.fetch,
    port: Env.PORT,
    hostname: 'localhost',
  },
  serverListenPromise.resolve,
) as Server;

NodeHttpServer.once('error', serverListenPromise.reject);
await serverListenPromise.promise;

Log.info(`API running at port ${Env.PORT}`);
