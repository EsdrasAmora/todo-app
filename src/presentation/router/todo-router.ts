import { DeleteTodo } from 'domain/delete-todo';
import { CreateTodo } from '../../domain/create-todo';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { FindTodo } from 'domain/find-todo';
import { TodoSchema } from 'model/todos.model';
import { AuthorizedContext } from 'presentation/trpc.context';
import { authMiddleware } from 'presentation/context';
import { FindUserTodos } from 'domain/find-user-todos';
import { UpdateTodo } from 'domain/update-todo';

export const TodoAppRouter = new OpenAPIHono<{ Variables: AuthorizedContext }>()
  // .use('*', authMiddleware)
  .openapi(
    createRoute({
      method: 'get',
      operationId: 'findUserTodos',
      path: '/',
      responses: {
        201: {
          content: {
            'application/json': {
              schema: TodoSchema.array(),
            },
          },
          description: 'Todo found',
        },
      },
    }),
    async (c) => {
      return c.jsonT(await FindUserTodos.execute(c.var), 200);
    },
  )
  .openapi(
    createRoute({
      method: 'patch',
      operationId: 'updateTodo',
      path: '/{id}',
      request: {
        body: {
          content: {
            'application/json': {
              schema: UpdateTodo.schema,
            },
          },
        },
        params: z.object({ id: z.string() }),
      },
      responses: {
        201: {
          content: {
            'application/json': {
              schema: TodoSchema.array(),
            },
          },
          description: 'Todo found',
        },
      },
    }),
    async (c) => {
      const input = c.req.valid('json');
      const { id } = c.req.valid('param');
      return c.json(await UpdateTodo.execute(id, input, c.var), 201);
    },
  )
  .openapi(
    createRoute({
      method: 'post',
      operationId: 'createTodo',
      path: '/',
      request: {
        body: {
          content: {
            'application/json': {
              schema: CreateTodo.schema,
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: TodoSchema,
            },
          },
          description: 'Created Todo',
        },
      },
    }),
    async (c) => {
      const input = c.req.valid('json');
      return c.jsonT(await CreateTodo.execute(input, c.var), 200);
    },
  )
  .openapi(
    createRoute({
      method: 'get',
      operationId: 'findTodoById',
      path: '/{id}',
      request: {
        params: z.object({ id: z.string() }),
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: TodoSchema,
            },
          },
          description: 'Todo found',
        },
      },
    }),
    async (c) => {
      const { id } = c.req.valid('param');
      return c.json(await FindTodo.execute(id, c.var), 200);
    },
  )
  .openapi(
    createRoute({
      method: 'delete',
      operationId: 'deleteTodo',
      path: '/{id}',
      request: {
        params: DeleteTodo.schema,
      },
      responses: {
        201: {
          content: {
            'application/json': {
              schema: TodoSchema,
            },
          },
          description: 'Todo found',
        },
      },
    }),
    async (c) => {
      const input = c.req.valid('param');
      return c.json(await DeleteTodo.execute(input, c.var), 201);
    },
  )
  .use('*', authMiddleware);
