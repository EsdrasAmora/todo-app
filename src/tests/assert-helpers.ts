import { assert, expect } from 'chai';

export const assertThrows = async (promise: Promise<any>, expected?: string | ((err: any) => void)) => {
  try {
    await promise;
  } catch (err) {
    if (!expected) {
      return;
    }
    if (typeof expected === 'function') {
      return expected(err);
    }
    return expect(err.message).to.be.eq(expected);
  }
  assert.fail('promise should have thrown an error');
};

export async function assertValidationError(promise: Promise<any>, expected: string) {
  return assertThrows(promise, (err) => expect(JSON.parse(err.message)[0].message).to.be.eq(expected));
}

export function isDefined<T>(value: T): asserts value is NonNullable<T> {
  expect(value).to.not.be.null;
  expect(value).to.not.be.undefined;
}
