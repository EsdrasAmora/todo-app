import { z } from 'zod';

export const EnvSchemaValidation = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  LOGGER_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  CRYPTO_SALT: z.string(),
  CRYPTO_DEFAULT_PASSWORD_LENGTH: z.coerce.number(),
  SERVER_DOMAIN: z.string().default('http://localhost:3000'),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.string().default('1d'),
  DATABASE_CONNECTION_LIMIT: z.coerce.number().default(30),
  DATABASE_CONNECTION_POOL_TIMEOUT: z.coerce.number().default(15),
  NODE_ENV: z.enum(['production', 'development', 'test']).default('production'),
});

export type EnvSchema = z.infer<typeof EnvSchemaValidation>;
