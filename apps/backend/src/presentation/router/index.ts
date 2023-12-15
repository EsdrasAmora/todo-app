import { trpc } from '../trpc.context';
import { todoRouter } from './todo.router';
import { userRouter } from './user.router';

export const appRouter = trpc.router({
  user: userRouter,
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
