import pdefer, { type DeferredPromise } from 'p-defer';
import { main } from './server';

let teardownPromise: DeferredPromise<void>;

//This function run BEFORE all tests, and do not share its enviroment with them
export default async function () {
  console.log('Running global setup');
  const { app } = await main();
  console.log('Finished global setup');

  const runTeardown = async () => {
    const start = Date.now();
    if (teardownPromise) {
      console.warn('Teardown already running, skipping');
      await teardownPromise.promise;
      return;
    }
    teardownPromise = pdefer();
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
    teardownPromise.resolve();
  };

  process.on('uncaughtException', function () {
    void runTeardown().finally(() => {
      setTimeout(() => process.exit(69), 10);
    });
  });

  return runTeardown;
}
