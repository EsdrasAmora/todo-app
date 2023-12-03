import pdefer, { type DeferredPromise } from 'p-defer';
import type { main } from './server';

export class ServerTeardown {
  private static state: DeferredPromise<void> | null = null;

  static async run(app: AwaitedReturn<typeof main>['app']) {
    const start = Date.now();
    if (this.state) {
      console.warn('Teardown already running, skipping');
      await this.state.promise;
      return;
    }
    this.state = pdefer();
    console.log('Running Teardown...');

    console.debug('Closing db pool');
    const { Sql } = await import('./db/client');
    await Sql.end().catch((err) => {
      console.error(new Error('Error while closing db pool', { cause: err }));
    });
    console.debug('Db pool closed');

    console.debug('Closing server');
    await new Promise<void>((res) =>
      app.close((err) => {
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
    this.state.resolve();
  }
}
