import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
});
