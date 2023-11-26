export async function main(envPath = 'test.env') {
  //Env must be imported first so it can be used safely in top-level files.
  console.log('Starting server...');
  console.debug('Loading env...');
  const { setupEnv, Env } = await import('./env');
  setupEnv(envPath);
  console.debug('env loaded');

  console.debug('starting db...');
  const { Sql } = await import('./db/client');
  await Sql`SELECT NOW()`;
  console.debug('db started');

  const { configApi } = await import('./presentation/index');
  console.debug('Configuring api...');
  const app = await configApi();

  const server = app.listen(Env.PORT, () => {
    console.log(`Server started on port ${Env.PORT}`);
  });

  return { router: app, server };
}

export type AppType = AwaitedReturn<typeof main>;
