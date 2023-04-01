import { CreateUser } from '../../domain/create-user';
import { publicProcedure, trpc } from '../trpc.context';
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
        tags: ['user'],
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
        path: '/users',
        tags: ['user'],
        summary: 'Login user',
      },
    })
    .input(CreateUser.schema)
    .output(userSchema)
    .mutation(({ input }) => CreateUser.execute(input)),
});
