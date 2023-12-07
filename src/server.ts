import pdefer, { type DeferredPromise } from 'p-defer';
import { Env } from './env';
import { Log } from './logger/index';
import { AppError } from './error';
import { Sql } from './db/client';
import { nodeHttpServer } from './presentation/index';

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

    Log.info('Closing db pool...');
    await Sql.end({ timeout: Env.DATABASE_SHUTDOWN_TIMEOUT }).catch((err) => {
      Log.error(new AppError('Teardown', 'Error while closing db pool', err));
    });
    Log.info('Db pool closed');

    Log.info('Closing server...');
    await new Promise<void>((res) =>
      nodeHttpServer.close((err) => {
        if (err) {
          Log.error(new AppError('Teardown', 'Error while closing server', err));
        } else {
          res();
        }
      }),
    );
    Log.info('Server closed');

    const duration = Date.now() - start;
    Log.info(`Teardown finished, took ${duration}ms`);
    this.teardownRunning.resolve();
  }
}
