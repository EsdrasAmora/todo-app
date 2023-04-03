import { createExpressMiddleware } from '@trpc/server/adapters/express';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';
import { Env } from '../env';
import { openApiDocument } from './openapi';
import { appRouter } from './router';
import { createTrpcContext } from './trpc.context';

export async function configApi(): Promise<express.Application> {
  const app = express();

  app.use(cors(Env.NODE_ENV !== 'production' ? { origin: '*' } : undefined));
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
      responseMeta: ({ errors, type }) => {
        if (!errors.length && type === 'mutation') {
          return { status: 201 };
        }
        return {};
      },
    }) as express.RequestHandler,
  );

  return app;
}

// const a =
