import { OpenAPIHono } from '@hono/zod-openapi';
import { TodoAppRouter } from './router/todo-router';
import { swaggerUI } from '@hono/swagger-ui';
// import { UserAppRouter } from './router/user-router';

export async function configApi() {
  const app = new OpenAPIHono({}).route('/todos', TodoAppRouter);
  // app.route('/users', UserAppRouter);

  app.get(
    '/ui',
    swaggerUI({
      url: '/doc',
    }),
  );
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'My API',
    },
  });

  return app;
}

export type AppType = Awaited<ReturnType<typeof configApi>>;
// const client = hc<AppType>('http://localhost:8787/');

// client.todos.$post({json: {title: }})
// client.todos.$post['{id}'];
