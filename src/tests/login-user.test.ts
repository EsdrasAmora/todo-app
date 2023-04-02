import { expect } from 'chai';
import { createUnauthorizedCaller } from './test-client';
import { clearDatabase } from './clear-db';
import { JwtService } from '../shared/jwt';
import { isDefined } from './assert-helpers';

describe.only('Login User', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('Login sucessfully', async () => {
    const client = createUnauthorizedCaller();
    const before = new Date();
    const user = await client.user.create({ email: 'foo@bar.com', password: 'ValidPassword12' });
    const result = await client.user.login({ email: 'foo@bar.com', password: 'ValidPassword12' });
    const decodedToken = JwtService.verify(result.authorization);
    isDefined(decodedToken);
    expect(decodedToken.data.userId).to.be.eq(user.id);
    expect(decodedToken.iat * 1000).to.be.approximately(before.getTime(), 1000);
  });
});
