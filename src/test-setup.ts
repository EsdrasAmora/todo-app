import { ServerTeardown } from './server-teardown';
import { main } from './server';

//This function run BEFORE all tests, and do not share its enviroment with them
export default async function () {
  console.log('Running global setup');
  const { app } = await main();
  console.log('Finished global setup');

  process.on('uncaughtException', function () {
    void ServerTeardown.run(app).finally(() => {
      setTimeout(() => process.exit(69), 10);
    });
  });

  return () => ServerTeardown.run(app);
}
