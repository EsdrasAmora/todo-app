import { main, AppType } from '../server';
import request from 'supertest';

let server: AppType['server'];
let router: ReturnType<typeof request>;

beforeAll(async () => {
  const app = await main();
  server = app.server;
  router = request(app.router);
});

describe('Create User', () => {
  test('Best overal results when empty input', async () => {
    const url = '';
    const res = await router.get(url);
    expect(res.status).toBe(200);
    const data = [23];

    expect(data).toEqual([
      { cuisine: 'Spanish', customerRating: 4, distance: 1, name: 'Deliciousgenix', price: 10 },
      { cuisine: 'Chinese', customerRating: 4, distance: 1, name: 'Deliciouszilla', price: 15 },
      { cuisine: 'Korean', customerRating: 4, distance: 1, name: 'Fodder Table', price: 20 },
      { cuisine: 'Korean', customerRating: 3, distance: 1, name: 'Dished Grill', price: 10 },
      { cuisine: 'Russian', customerRating: 3, distance: 1, name: 'Sizzle Yummy', price: 15 },
    ]);
  });
});

afterAll(() => {
  server.close();
});
