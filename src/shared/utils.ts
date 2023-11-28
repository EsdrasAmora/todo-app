import { z } from '@hono/zod-openapi';

export const DateSchema = z.string().datetime({ offset: true }).or(z.date());
