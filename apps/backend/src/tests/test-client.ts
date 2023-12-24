import type { TestAPI } from 'vitest';
import { faker } from '@faker-js/faker';
import { test } from 'vitest';

import { Database } from '../db';
import { appRouter } from '../presentation/router';

export async function createUser() {
  const result = await Database.insertInto('users')
    .values({
      email: faker.internet.email(),
      hashedPassword: 'anything',
      passwordSeed: 'anything',
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return result;
}

export async function createTodo(userId: string) {
  const createdAt = faker.date.past();
  const result = await Database.insertInto('todos')
    .values({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      userId,
      updatedAt: new Date(createdAt.getTime() + 10 * 60 * 1000),
      createdAt,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return result;
}

export async function createTodos(userId: string, amount: number) {
  const createdAt = faker.date.past();
  const result = await Database.insertInto('todos')
    .values(
      [...Array(amount)].map(() => ({
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        userId,
        updatedAt: new Date(createdAt.getTime() + 10 * 60 * 1000),
        createdAt,
      })),
    )
    .returningAll()
    .execute();

  return result;
}

export function createCaller(userId: string) {
  return appRouter.createCaller({
    __type: 'AuthenticatedContext',
    userId,
    path: '/trpc',
    uuid: '',
    method: '',
  });
}

export function createUnauthorizedCaller() {
  return appRouter.createCaller({ __type: 'UnauthenticatedContext', path: '/trpc', uuid: '', method: '' });
}

interface AppFixtures {
  auth: {
    client: ReturnType<typeof createCaller>;
    user: AwaitedReturn<typeof createUser>;
  };
  unAuth: {
    client: ReturnType<typeof createUnauthorizedCaller>;
  };
}

export const appTest: TestAPI<AppFixtures> = test.extend({
  // eslint-disable-next-line no-empty-pattern
  auth: async ({}, use) => {
    const user = await createUser();
    const client = createCaller(user.id);

    await use({ client, user });
  },
  // eslint-disable-next-line no-empty-pattern
  unAuth: async ({}, use) => {
    const client = createUnauthorizedCaller();
    await use({ client });
  },
});
