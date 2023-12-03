import { Server } from './server';

async function run() {
  const server = await Server.run('.env');

  //TODO: handle other signals
  process.on('SIGTERM', () => {
    void server.teardown().then(() => {
      process.exit(99);
    });
  });

  process.on('uncaughtException', () => {
    console.log('TODO');
  });
}

void run();
