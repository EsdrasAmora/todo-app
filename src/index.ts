import { ServerTeardown } from './server-teardown';
import { main } from './server';

//TODO: https://github.com/privatenumber/tsx/issues/393

async function run() {
  const { app } = await main('.env');

  //TODO: handle other signals
  process.on('SIGTERM', () => {
    void ServerTeardown.run(app).then(() => {
      process.exit(99);
    });
  });

  process.on('uncaughtException', () => {
    console.log('TODO');
  });
}

void run();
