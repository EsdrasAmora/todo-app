import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  verbose: true,
  dbCredentials: {
    connectionString: 'postgresql://postgres_user:postgres_password@localhost:5432/todo_app_db',
  },
} satisfies Config;
