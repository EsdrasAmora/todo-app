// import { AppType } from '../server';
// import request from 'supertest';
import { createUnauthorizedCaller } from './test-client';

// let server: AppType['server'];
// let router: ReturnType<typeof request>;

// beforeAll(async () => {
// const app = await main();
// server = app.server;
// router = request(app.router);
// });

describe('Create User', () => {
  test('Create sucessfully', async () => {
    const client = createUnauthorizedCaller();
    const result = await client.user.create({ email: 'foo@bar.com', password: 'ValidPassword12' });

    expect(result).toEqual({});
  });
});

// afterAll(() => {
// server.close();

// });
