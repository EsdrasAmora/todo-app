import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const connectionString = process.env.DATABASE_URL!;
console.log({ connectionString });
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

void migrate(db, { migrationsFolder: 'drizzle' }).then(() => {
  console.log('GGGGGGGGGGGGGGGGGGG');
});
