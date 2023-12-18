import { Log } from '../logger';
import { Server } from '../server';

//This function run BEFORE all tests and doesn't share its enviroment with them
export default function () {
  Log.info('Running global setup');
  Log.info('Finished global setup');
  process.on('uncaughtException', () => {
    // This is probably a bug in vitest.
    Log.info('CTRL+C pressed, exiting');
  });

  return () => Server.teardown();
}
