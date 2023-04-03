import { CreateUser } from '../../domain/create-user';
import { FetchCurrentUser } from '../../domain/fetch-current-user';
import { LoginUser } from '../../domain/login-user';
import { authorizedProcedure, publicProcedure, trpc } from '../trpc.context';
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string().email(),
});

export const userRouter = trpc.router({
  create: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/users',
        tags: ['User'],
        summary: 'Create new User',
      },
    })
    .input(CreateUser.schema)
    .output(userSchema)
    .mutation(({ input }) => CreateUser.execute(input)),
  login: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/login',
        tags: ['User'],
        summary: 'Login user',
      },
    })
    .input(LoginUser.schema)
    .output(z.object({ authorization: z.string() }))
    .mutation(({ input }) => LoginUser.execute(input)),
  currentUser: authorizedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/users/me',
        tags: ['User'],
        summary: 'Retrieve current user',
        protect: true,
      },
    })
    .input(FetchCurrentUser.schema)
    .output(userSchema)
    .mutation(({ ctx }) => FetchCurrentUser.execute(ctx)),
  deleteUser: authorizedProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/users',
        tags: ['User'],
        summary: 'Delete the current user and all its Todos permanently',
        protect: true,
      },
    })
    .input(FetchCurrentUser.schema)
    .output(userSchema)
    .mutation(({ ctx }) => FetchCurrentUser.execute(ctx)),
});
