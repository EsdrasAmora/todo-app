import { beforeEach, describe, expect, it } from 'vitest';

import { JwtService } from '../shared/jwt';
import { assertThrows, isDefined } from './assert-helpers';
import { clearDatabase } from './clear-db';
import { createUnauthorizedCaller } from './test-client';

describe('Login User', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  it('should login successfully', async () => {
    const client = createUnauthorizedCaller();
    const before = new Date();
    const user = await client.user.create({ email: 'temp@bar.com', password: 'ValidPassword12' });
    const result = await client.user.login({ email: 'temp@bar.com', password: 'ValidPassword12' });
    const decodedToken = JwtService.verify(result.authorization);
    isDefined(decodedToken);
    expect(decodedToken.data.userId).to.be.eq(user.id);
    expect(decodedToken.iat * 1000).to.be.approximately(before.getTime(), 1000);
  });

  it('should error: email not found', async () => {
    const client = createUnauthorizedCaller();
    const result = client.user.login({ email: 'foo@bar.com', password: 'ValidPassword12' });
    await assertThrows(result, 'User not found');
  });

  it('should error: invalid credentials', async () => {
    const client = createUnauthorizedCaller();
    await client.user.create({ email: 'foo@bar.com', password: 'OtherPassword3' });
    const result = client.user.login({ email: 'foo@bar.com', password: 'ValidPassword12' });
    await assertThrows(result, 'Invalid credentials');
  });
});
