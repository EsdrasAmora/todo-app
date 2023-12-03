import { setupEnv, Env } from './env';
import pdefer, { type DeferredPromise } from 'p-defer';

export class Server {
  private teardownRunning: DeferredPromise<void> | undefined;
  api: AwaitedReturn<typeof Server.initServer>;

  private constructor(api: AwaitedReturn<typeof Server.initServer>) {
    this.api = api;
  }

  //We must use dynamic imports here to allow Env and Logger to be used without DI.
  static async run(envPath = 'test.env') {
    console.log('Starting server...');
    const start = Date.now();
    console.debug('Loading env...');
    await setupEnv(envPath);
    console.debug('Env loaded');
    const [app] = await Promise.all([this.initServer(), this.initDb()]);
    console.debug(`Server startup took ${(Date.now() - start) / 1000} seconds`);
    return new Server(app);
  }

  private static async initDb() {
    console.debug('Starting DB...');
    const { Sql } = await import('./db/client');
    const [{ now }] = await Sql`SELECT NOW()`;
    console.debug(`DB started, dbTime: ${now as Date}`);
  }

  private static async initServer() {
    const { configApi } = await import('./presentation/index');
    console.debug('Configuring API...');
    const api = await configApi();
    console.log(`API running at port ${Env.PORT}`);
    return api;
  }

  //make it auto called with `using`
  async teardown() {
    const start = Date.now();
    if (this.teardownRunning) {
      console.warn('Teardown already running, skipping');
      await this.teardownRunning.promise;
      return;
    }
    this.teardownRunning = pdefer();
    console.log('Running Teardown...');

    console.debug('Closing db pool');
    const { Sql } = await import('./db/client');
    await Sql.end().catch((err) => {
      console.error(new Error('Error while closing db pool', { cause: err }));
    });
    console.debug('Db pool closed');

    console.debug('Closing server');
    await new Promise<void>((res) =>
      this.api.close((err) => {
        if (err) {
          console.error(new Error('Error while closing server', { cause: err }));
        } else {
          res();
        }
      }),
    );
    console.debug('Server closed');

    const duration = Date.now() - start;
    console.log(`Teardown finished, took ${duration}ms`);
    this.teardownRunning.resolve();
  }
}
