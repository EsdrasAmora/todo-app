import { trpc } from '../trpc.context';
import { userRouter } from './user.router';
import { todoRouter } from './todo.router';

export const appRouter = trpc.router({
  user: userRouter,
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
