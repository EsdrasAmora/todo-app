import { beforeEach, describe, expect } from 'vitest';

import { clearDatabase } from '../scripts/clear-db';
import { JwtService } from '../shared/jwt';
import { assertThrows, isDefined } from './assert-helpers';
import { appTest } from './test-client';

describe('Login User', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  appTest('should login successfully', async ({ unAuth: { client, spies } }) => {
    const before = new Date();
    const user = await client.user.create({ email: 'temp@bar.com', password: 'ValidPassword12' });
    const result = await client.user.login({ email: 'temp@bar.com', password: 'ValidPassword12' });
    const decodedToken = JwtService.verify(result.authorization);
    isDefined(decodedToken);
    expect(decodedToken.data.userId).to.be.eq(user.id);
    expect(decodedToken.iat * 1000).to.be.approximately(before.getTime(), 1000);
    expect(spies.setCookie.mock.calls[0]).to.be.deep.eq(['authorization', result.authorization]);
  });

  appTest('should error: email not found', async ({ unAuth: { client } }) => {
    const result = client.user.login({ email: 'foo@bar.com', password: 'ValidPassword12' });
    await assertThrows(result, 'User not found');
  });

  appTest('should error: invalid credentials', async ({ unAuth: { client } }) => {
    await client.user.create({ email: 'foo@bar.com', password: 'OtherPassword3' });
    const result = client.user.login({ email: 'foo@bar.com', password: 'ValidPassword12' });
    await assertThrows(result, 'Invalid credentials');
  });
});
