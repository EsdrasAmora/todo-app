export async function main(envPath = 'test.env') {
  //import order must be preserved, so Env can be used safely used on top file level and static class properties
  const { setupEnv } = await import('./env');
  setupEnv(envPath);

  const { configApi } = await import('./presentation/index');

  const app = await configApi();

  const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
  return { router: app, server };
}

export type AppType = AwaitedReturn<typeof main>;
