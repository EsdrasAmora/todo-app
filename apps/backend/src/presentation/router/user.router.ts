import { z } from 'zod';

import { CreateUser } from '../../domain/create-user';
import { DeleteUser } from '../../domain/delete-user';
import { FetchCurrentUser } from '../../domain/fetch-current-user';
import { LoginUser } from '../../domain/login-user';
import { LogoutUser } from '../../domain/logout-user';
import { userSchema } from '../../model/user.model';
import { authorizedProcedure, publicProcedure, trpc } from '../trpc.context';

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
        example: {
          request: {
            email: 'test.taqtile@gmail.com',
            password: 'ABCDabcd!@#$1234',
          },
        },
        summary: 'Login user',
      },
    })
    .input(LoginUser.schema)
    .output(z.object({ authorization: z.string() }))
    .mutation(({ input, ctx }) => LoginUser.execute(input, ctx)),
  logout: authorizedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/logout',
        tags: ['User'],
        summary: 'Logout user',
      },
    })
    .input(z.void())
    .output(z.void())
    .mutation(({ ctx }) => LogoutUser.execute(ctx)),
  me: authorizedProcedure
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
    .query(({ ctx }) => FetchCurrentUser.execute(ctx)),
  delete: authorizedProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/users',
        tags: ['User'],
        summary: 'Delete current user and all related data',
        protect: true,
      },
    })
    .input(z.void())
    .output(z.void())
    .mutation(({ ctx }) => DeleteUser.execute(ctx)),
});
