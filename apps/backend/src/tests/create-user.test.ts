import { beforeEach, describe, expect, test } from 'vitest';

import { Env } from '../env';
import { assertThrows, assertValidationError } from './assert-helpers';
import { clearDatabase } from './clear-db';
import { appTest, createUnauthorizedCaller } from './test-client';

describe('Create User', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  appTest('should create a user successfully', async ({ unAuth: { client } }) => {
    const now = new Date();
    const result = await client.user.create({ email: 'foo@bar.com', password: 'ValidPassword12' });

    expect(result.createdAt).to.be.gte(now);
    expect(result.updatedAt).to.be.gte(now);
    expect(result.email).to.be.eq('foo@bar.com');
    expect(result.id).to.be.a('string');
  });

  appTest('should error: email already in use', async ({ unAuth: { client } }) => {
    await client.user.create({ email: 'foo@bar.com', password: 'ValidPassword12' });
    const result = client.user.create({ email: 'foo@bar.com', password: 'ValidPassword12' });
    await assertThrows(result, 'Email already in use');
  });

  appTest('should error: empty title validation erro', async ({ unAuth: { client } }) => {
    const result = client.user.create({ email: 'foo', password: 'ValidPassword12' });
    await assertValidationError(result, 'Invalid email');
  });

  const passwordValidationCases = test.each([
    ['invalidpassword1', 'Must contain at least one uppercase letter'],
    ['INVALIDPASSWORD1', 'Must contain at least one lowercase letter'],
    ['InvalidPassowrd', 'Must contain at least one digit'],
    ['A1b', `String must contain at least ${Env.PASSWORD_MIN_LENGTH} character(s)`],
  ]);

  passwordValidationCases('passwordValidation(%s) -> %s', async (password, errorMessage) => {
    const client = createUnauthorizedCaller();
    const result = client.user.create({ email: 'foo@bar.com', password });
    await assertValidationError(result, errorMessage);
  });
});
