import { setupEnv, Env } from './env';

//We must use dynamic imports here to allow Env and Logger to be used without DI.
export async function main(envPath = 'test.env') {
  console.log('Starting server...');
  const start = Date.now();
  console.debug('Loading env...');
  await setupEnv(envPath);
  console.debug('Env loaded');

  const [, app] = await Promise.all([initDb(), initServer()]);
  console.debug(`Server startup took ${(Date.now() - start) / 1000} seconds`);

  return { app };
}

async function initDb() {
  console.debug('Starting DB...');
  const { Sql } = await import('./db/client');
  const [{ now }] = await Sql`SELECT NOW()`;
  console.debug(`DB started, dbTime: ${now as Date}`);
}

async function initServer() {
  const { configApi } = await import('./presentation/index');
  console.debug('Configuring API...');
  const app = await configApi();
  console.log(`API running at port ${Env.PORT}`);
  return app;
}
