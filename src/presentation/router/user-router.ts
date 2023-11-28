// import { UserSchema } from 'model/users.model';
// import { CreateUser } from '../../domain/create-user';
// import { DeleteUser } from '../../domain/delete-user';
// import { FetchCurrentUser } from '../../domain/fetch-current-user';
// import { LoginUser } from '../../domain/login-user';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { CreateUser } from 'domain/create-user';
import { UserSchema } from 'model/users.model';
import { AuthorizedContext } from '../trpc.context';

export const UserAppRouter = new OpenAPIHono<{ Variables: AuthorizedContext }>();

// import { authMiddleware } from 'presentation/context';
// UserAppRouter.use('*', authMiddleware);

UserAppRouter.openapi(
  createRoute({
    method: 'post',
    operationId: 'createUser',
    path: '/',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateUser.schema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: UserSchema,
          },
        },
        description: 'Created User',
      },
    },
  }),
  async (c) => {
    const input = c.req.valid('json');
    const result = await CreateUser.execute(input);
    return c.json(result, 201);
  },
);
