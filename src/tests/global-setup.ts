import { Server } from '../server';

//This function run BEFORE all tests, and do not share its enviroment with them
export default async function () {
  console.log('Running global setup');
  const server = await Server.run();
  console.log('Finished global setup');
  process.on('uncaughtException', () => {
    // This is probably a bug in vitest.
    console.log('CTRL+C pressed, exiting');
  });

  return () => server.teardown();
}
