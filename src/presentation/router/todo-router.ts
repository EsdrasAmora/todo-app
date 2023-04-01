import { CreateUser } from '../../domain/create-user';
import { publicProcedure, trpc } from '../trpc.context';
import { z } from 'zod';

const todoSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string().email(),
});

export const todoRouter = trpc.router({
  create: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/todos',
        tags: ['todo'],
        summary: 'Create new Todo',
      },
    })
    .input(CreateUser.schema)
    .output(todoSchema)
    .mutation(({ input }) => CreateUser.execute(input)),
});
