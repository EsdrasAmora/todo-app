import { z } from 'zod';

export const EnvSchemaValidation = z.object({
  PORT: z.coerce.number().int().default(3000),
  LOGGER_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  PASSWORD_MIN_LENGTH: z.coerce.number().int().default(8),
  SECRET_PASSWORD_SALT: z.string(),
  CRYPTO_DEFAULT_PASSWORD_LENGTH: z.coerce.number().int(),
  SERVER_DOMAIN: z.string().default('http://localhost:3000'),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.string().default('1d'),
  DATABASE_URL: z.string().url(),
  DATABASE_CONNECTION_LIMIT: z.coerce.number().int().default(30),
  DATABASE_CONNECTION_POOL_TIMEOUT: z.coerce.number().int().default(15),
  DATABASE_POOL_SHUTDOWN_TIMEOUT: z.coerce.number().int().default(10),
  DATABASE_POOL_MAX_CONNECTIONS: z.coerce.number().int().default(10),
  SERVER_CLOSE_TIMEOUT: z.coerce.number().int().default(10),
  DATABASE_POOL_IDLE_CONNECTION_TIMEOUT: z.coerce.number().int().default(30),
  DATABASE_POOL_ACQUIRE_CONNECTION_TIMEOUT: z.coerce.number().int().default(30),
  NODE_ENV: z.enum(['production', 'development', 'test']).default('production'),
  IS_RUNNIG_ON_CLOUD: z.boolean().default(false),
  CORS_ALLOW_ORIGIN: z.string().default('*'),
});
