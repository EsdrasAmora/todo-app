import { expect } from 'chai';
import { createUnauthorizedCaller } from './test-client';
import { clearDatabase } from './clear-db';
import { assertThrows, assertValidationError } from './assert-helpers';
import { Env } from '../env';

describe('Create User', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should create a user successfully', async () => {
    const client = createUnauthorizedCaller();
    const now = new Date();
    const result = await client.user.create({ email: 'foo@bar.com', password: 'ValidPassword12' });

    expect(result.createdAt).to.be.gte(now);
    expect(result.updatedAt).to.be.gte(now);
    expect(result.email).to.be.eq('foo@bar.com');
    expect(result.id).to.be.a('string');
  });

  it('should error: email already in use', async () => {
    const client = createUnauthorizedCaller();
    await client.user.create({ email: 'foo@bar.com', password: 'ValidPassword12' });
    const result = client.user.create({ email: 'foo@bar.com', password: 'ValidPassword12' });
    await assertThrows(result, 'Email already in use');
  });

  it('should error: empty title validation erro', async () => {
    const client = createUnauthorizedCaller();
    const result = client.user.create({ email: 'foo', password: 'ValidPassword12' });
    await assertValidationError(result, 'Invalid email');
  });

  describe('should error: invalid password', () => {
    it('should be missing a uppercase letter', async () => {
      const client = createUnauthorizedCaller();
      const result = client.user.create({ email: 'foo@bar.com', password: 'invalidpassword1' });
      await assertValidationError(result, 'Must contain at least one uppercase letter');
    });
    it('should be missing a lowercasse letter', async () => {
      const client = createUnauthorizedCaller();
      const result = client.user.create({ email: 'foo@bar.com', password: 'INVALIDPASSWORD1' });
      await assertValidationError(result, 'Must contain at least one lowercase letter');
    });
    it('should be missing a digit', async () => {
      const client = createUnauthorizedCaller();
      const result = client.user.create({ email: 'foo@bar.com', password: 'InvalidPassowrd' });
      await assertValidationError(result, 'Must contain at least one digit');
    });
    it('should be less than the mininun lenght', async () => {
      const client = createUnauthorizedCaller();
      const result = client.user.create({ email: 'foo@bar.com', password: 'A1b' });
      await assertValidationError(result, `String must contain at least ${Env.PASSWORD_MIN_LENGTH} character(s)`);
    });
  });
});
