export async function main(envPath = 'test.env') {
  //Import order must be preserved so that Env can be used safely used on files' top level and in static class properties
  const { setupEnv, Env } = await import('./env');
  setupEnv(envPath);
  const { prisma } = await import('./db/client');
  const { configApi } = await import('./presentation/index');

  await prisma.$connect();
  const app = await configApi();

  const server = app.listen(Env.PORT, () => {
    console.log(`Server started on port ${Env.PORT}`);
  });
  return { router: app, server };
}

export type AppType = AwaitedReturn<typeof main>;
