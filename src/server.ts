export async function main(envPath = 'test.env') {
  //Env must be imported first so it can be used safely in top-level files.
  const start = Date.now();
  console.log('Starting server...');
  console.debug('Loading env...');
  const { setupEnv } = await import('./env');
  setupEnv(envPath);
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
  return app;
}
