import type { createUnauthorizedCaller } from './test-client';
import { assertThrows } from './assert-helpers';
import { appTest } from './test-client';

type Router = Omit<ReturnType<typeof createUnauthorizedCaller>['client'], 'mutation' | 'subscription' | 'query'>;
type RouterKeys = keyof Router;

export function checkAuthenticatedRoute<T extends RouterKeys>(key: T, method: keyof Router[T]) {
  appTest('should error: unauthorized - missing header', ({ unAuth: { client } }) => {
    return assertThrows((client[key][method] as any)(), 'Missing, invalid or expired authorization header');
  });
}
