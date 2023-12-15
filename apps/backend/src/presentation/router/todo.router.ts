import { z } from 'zod';

import { CreateTodo } from '../../domain/create-todo';
import { DeleteTodo } from '../../domain/delete-todo';
import { FindTodo } from '../../domain/find-todo';
import { FindUserTodos } from '../../domain/find-user-todos';
import { UpdateTodo } from '../../domain/update-todo';
import { todoSchema } from '../../model/todo.model';
import { authorizedProcedure, trpc } from '../trpc.context';

export const todoRouter = trpc.router({
  create: authorizedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/todos',
        tags: ['Todo'],
        summary: 'Create new Todo',
        protect: true,
      },
    })
    .input(CreateTodo.schema)
    .output(todoSchema)
    .mutation(({ input, ctx }) => CreateTodo.execute(input, ctx)),
  update: authorizedProcedure
    .meta({
      openapi: {
        method: 'PATCH',
        path: '/todos',
        tags: ['Todo'],
        summary: 'Update Todo',
        protect: true,
      },
    })
    .input(UpdateTodo.schema)
    .output(todoSchema)
    .mutation(({ input, ctx }) => UpdateTodo.execute(input, ctx)),
  delete: authorizedProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/todos',
        tags: ['Todo'],
        summary: 'Soft delete a Todo',
        protect: true,
      },
    })
    .input(DeleteTodo.schema)
    .output(z.void())
    .mutation(({ input, ctx }) => DeleteTodo.execute(input, ctx)),
  findById: authorizedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/todos/:todoId',
        tags: ['Todo'],
        summary: 'Find Todo by id',
        protect: true,
      },
    })
    .input(FindTodo.schema)
    .output(todoSchema)
    .mutation(({ input, ctx }) => FindTodo.execute(input, ctx)),
  findUserTodos: authorizedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/todos',
        tags: ['Todo', 'User'],
        summary: 'Find Todos by user',
        protect: true,
      },
    })
    .input(FindUserTodos.schema)
    .output(todoSchema.array())
    .mutation(({ ctx }) => FindUserTodos.execute(ctx)),
});
