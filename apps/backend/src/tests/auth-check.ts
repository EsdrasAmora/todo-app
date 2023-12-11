import { assertThrows } from './assert-helpers';
import { createUnauthorizedCaller } from './test-client';
import { it } from 'vitest';

type Router = Omit<ReturnType<typeof createUnauthorizedCaller>, 'mutation' | 'subscription' | 'query'>;
type RouterKeys = keyof Router;

export function checkAuthenticatedRoute<T extends RouterKeys>(key: T, method: keyof Router[T]) {
  it('should error: unauthorized - missing header', async () => {
    const client = createUnauthorizedCaller();

    await assertThrows((client[key][method] as any)(), 'Missing, invalid or expired authorization header');
  });
}
