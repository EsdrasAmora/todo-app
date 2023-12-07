import { Log } from '../logger';
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
import { apiReference } from '@scalar/hono-api-reference';

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

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
  }),
);

app.get('/', (c) => c.redirect('/swagger'));
app.get('/docs.json', (c) => c.text(openApiJsonDoc));
app.get('/ui', apiReference({ spec: { url: '/docs.json' } }));
//Remove swagger if the scalar is good enough
app.get('/swagger', swaggerUI({ url: '/docs.json' }));
app.get('/health-check', async (c) => {
  startTime(c, 'DB call', 'SELECT 1');
  const dbTime = (await Sql`SELECT 1`)[0].now;
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

export const nodeHttpServer = serve(
  {
    fetch: app.fetch,
    port: Env.PORT,
    hostname: 'localhost',
    //try out this, check if hono works in this case
    // createServer,
  },
  serverListenPromise.resolve,
) as Server;

nodeHttpServer.once('error', serverListenPromise.reject);
await serverListenPromise.promise;

Log.info(`API running at port ${Env.PORT}`);
