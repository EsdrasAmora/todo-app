import './import-test-env';
import { Server } from '../server';
import { Log } from '../logger';

//This function run BEFORE all tests, and do not share its enviroment with them
export default function () {
  Log.info('Running global setup');
  Log.info('Finished global setup');
  process.on('uncaughtException', () => {
    // This is probably a bug in vitest.
    Log.info('CTRL+C pressed, exiting');
  });

  return () => Server.teardown();
}
