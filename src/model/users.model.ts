import { z } from '@hono/zod-openapi';
import { DateSchema } from 'shared/utils';

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    createdAt: DateSchema,
    updatedAt: DateSchema,
    email: z.string().email(),
  })
  .openapi('User');
