import { Env } from '../env';

import { createExpressMiddleware } from '@trpc/server/adapters/express';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';
import { appRouter } from './router';
import { createTrpcContext } from './trpc.context';
import { openApiDocument } from './openapi';

export async function configure(): Promise<express.Application> {
  const app = express();

  app.use(cors(Env.NODE_ENV !== 'production' ? { origin: '*' } : undefined));
  app.use(express.json());
  app.use(compression());
  app.use(helmet());

  app.use('/', swaggerUi.serve);
  app.get('/', swaggerUi.setup(openApiDocument));
  app.use('/api/trpc', createExpressMiddleware({ router: appRouter, createContext: createTrpcContext }));
  app.use(
    '/api',
    createOpenApiExpressMiddleware({
      router: appRouter,
      createContext: createTrpcContext,
    }) as express.RequestHandler,
  );

  return app;
}
