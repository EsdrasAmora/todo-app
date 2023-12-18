import type { DeferredPromise } from 'p-defer';
import pdefer from 'p-defer';

import { Sql } from './db/client';
import { Env } from './env';
import { AppError } from './error';
import { Log } from './logger/index';
import { NodeHttpServer } from './presentation/index';

export class Server {
  private static teardownRunning: DeferredPromise<void> | undefined;

  static {
    Log.info(`Server startup took ${process.uptime()} seconds`);
  }

  static async teardown() {
    const start = Date.now();
    if (this.teardownRunning) {
      console.warn('Teardown already running, skipping');
      await this.teardownRunning.promise;
      return;
    }
    this.teardownRunning = pdefer();
    Log.info('Running Teardown...');

    Log.info('Closing server...');
    await new Promise<void>((res) => {
      const closeServerTimeout = setTimeout(() => {
        Log.error(new AppError('Teardown', 'Server did not close in time'));
        NodeHttpServer.removeAllListeners('close');
        res();
      }, Env.SERVER_CLOSE_TIMEOUT);
      NodeHttpServer.close((err) => {
        clearTimeout(closeServerTimeout);
        if (err) {
          Log.error(new AppError('Teardown', 'Error while closing server', err));
        } else {
          res();
        }
      });
    });
    Log.info('Server closed');

    Log.info('Closing db pool...');
    await Sql.end({ timeout: Env.DATABASE_POOL_SHUTDOWN_TIMEOUT }).catch((err) => {
      Log.error(new AppError('Teardown', 'Error while closing db pool', err));
    });
    Log.info('Db pool closed');

    const duration = Date.now() - start;
    Log.info(`Teardown finished, took ${duration}ms`);
    this.teardownRunning.resolve();
  }
}
