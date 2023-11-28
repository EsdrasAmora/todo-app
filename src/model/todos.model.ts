import { z } from '@hono/zod-openapi';
import { DateSchema } from 'shared/utils';

export const TodoSchema = z
  .object({
    id: z.string().uuid(),
    createdAt: DateSchema,
    updatedAt: DateSchema,
    title: z.string(),
    description: z.string().nullable(),
    completed: z.boolean(),
  })
  .openapi('Todo');
