import { main } from './server';

let teardownHappened = false;

//This function run BEFORE all tests, and do not share its enviroment with them
export default async function () {
  console.log('Running global setup');
  const { app } = await main();
  const start = Date.now();
  console.log('Finished global setup');

  const runTeardown = async () => {
    if (teardownHappened) {
      throw new Error('Teardown called twice');
    }
    teardownHappened = true;
    console.log('Running Teardown...');

    console.debug('Closing db pool');
    const { Sql } = await import('./db/client');
    await Sql.end().catch((err) => {
      console.error(new Error('Error while closing db pool', { cause: err }));
    });
    console.debug('Db pool closed');

    console.debug('Closing server');
    await new Promise<void>((resolve) =>
      app.close((err) => {
        if (err) {
          console.error(new Error('Error while closing server', { cause: err }));
        } else {
          resolve();
        }
      }),
    );
    console.debug('Server closed');

    const duration = Date.now() - start;
    console.log(`Teardown finished, took ${duration}ms`);
  };

  process.on('uncaughtException', function () {
    void runTeardown().finally(() => {
      process.exit(69);
    });
  });

  return runTeardown;
}
