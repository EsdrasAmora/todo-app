import { faker } from '@faker-js/faker';

import { contextSymbol } from '../context';
import { DbClient } from '../db/client';
import { TodoEntity, UserEntity } from '../db/schema';
import { appRouter } from '../presentation/router';

export async function createUser() {
  const [result] = await DbClient.insert(UserEntity)
    .values({
      email: faker.internet.email(),
      hashedPassword: 'anything',
      passwordSeed: 'anything',
    })
    .returning();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return result!;
}

export async function createTodo(userId: string) {
  const createdAt = faker.date.past();
  const [result] = await DbClient.insert(TodoEntity)
    .values({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      userId,
      updatedAt: new Date(createdAt.getTime() + 10 * 60 * 1000),
      createdAt,
    })
    .returning();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return result!;
}

export function createCaller(userId: string) {
  return appRouter.createCaller({
    [contextSymbol]: 'AuthenticatedContext',
    userId,
    path: '/trpc',
    uuid: '',
    method: '',
  });
}

export function createUnauthorizedCaller() {
  return appRouter.createCaller({ [contextSymbol]: 'UnauthenticatedContext', path: '/trpc', uuid: '', method: '' });
}
