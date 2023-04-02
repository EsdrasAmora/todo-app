import { expect } from 'chai';
import { createUnauthorizedCaller } from './test-client';

describe('Create User', () => {
  it('Create sucessfully', async () => {
    const client = createUnauthorizedCaller();
    const result = await client.user.create({ email: 'foo@bar.com', password: 'ValidPassword12' });

    expect(result).to.be.deep.eq({});
  });
});
