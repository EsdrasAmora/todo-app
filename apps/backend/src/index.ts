import { AppError } from './error';
import { Log } from './logger';
import { Server } from './server';

//Check https://github.com/porsager/prexit
const signals = ['SIGTERM', 'SIGINT'] as const;
const errors = ['uncaughtException', 'unhandledRejection'] as const;

function run() {
  for (const event of signals) {
    process.on(event, (_it) => {
      Log.info(`Received signal "${event}", terminating`);
      terminate(0);
    });
  }

  for (const event of errors) {
    process.on(event, (err) => {
      Log.error(new AppError('UncaughtException', `[${event}]: Error outside request lifecicle, terminating`, err));
      terminate(1);
    });
  }
}

function terminate(code: number) {
  void Server.teardown().then(() => {
    setTimeout(() => {
      process.exit(code);
    }, 0);
  });
}

run();
