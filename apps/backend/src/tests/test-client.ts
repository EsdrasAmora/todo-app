import { faker } from '@faker-js/faker';

import { Database } from '../db/client';
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
