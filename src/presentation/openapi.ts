import { generateOpenApiDocument } from 'trpc-openapi';
import { Env } from '../env';
import { appRouter } from './router';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Todo API',
  description: 'Api to manage todos',
  version: '1.0.0',
  baseUrl: `${Env.SERVER_DOMAIN}/api`,
});
