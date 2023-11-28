import { generateOpenApiDocument } from 'trpc-openapi';
import { Env } from '../env';
import { appRouter } from './router';

const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Todo API',
  description: 'Api to manage todos',
  version: '1.0.0',
  baseUrl: `${Env.SERVER_DOMAIN}/api`,
});

export const openApiJsonDoc = JSON.stringify(openApiDocument);
