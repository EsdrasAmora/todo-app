import { assertThrows } from './assert-helpers';
import { createUnauthorizedCaller } from './test-client';

type Router = Omit<ReturnType<typeof createUnauthorizedCaller>, 'mutation' | 'subscription' | 'query'>;
type RouterKeys = keyof Router;

export function checkAuthorizedRoute<T extends RouterKeys>(key: T, method: keyof Router[T]) {
  it('should error: unauthorized - missing header', async () => {
    const client = createUnauthorizedCaller();

    await assertThrows((client[key][method] as any)(), 'Missing authorization header');
  });
  //TODO: not sure if i should add this
  // it.skip('should error: unauthorized - invalid jwt', async () => {
  //   const client = appRouter.createCaller({ authorization: 'invalidJwt', [contextSymbol]: true });

  //   await assertThrows((client[key][method] as any)(), 'Missing authorization header');
  // });
}
