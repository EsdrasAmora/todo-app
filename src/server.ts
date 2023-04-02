export async function main(envPath = 'test.env') {
  //Env must be the first to be imported so it can be used safely used on files' top level and in static class properties
  console.log('Starting server...');

  const { setupEnv, Env } = await import('./env');
  console.debug('Loading env...');
  setupEnv(envPath);
  console.debug('env loaded');

  const { prisma } = await import('./db/client');
  console.debug('starting db...');
  await prisma.$connect();
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
