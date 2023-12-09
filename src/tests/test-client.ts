import { appRouter } from '../presentation/router';
import { contextSymbol } from '../context';
import { JwtService } from '../shared/jwt';
import { DbClient } from '../db/client';
import { faker } from '@faker-js/faker';
import { TodoEntity, UserEntity } from '../db/schema';

export async function createUser() {
  const [result] = await DbClient.insert(UserEntity)
    .values({
      email: faker.internet.email(),
      hashedPassword: 'anything',
      passwordSeed: 'anything',
    })
    .returning();
  return result;
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
  return result;
}

export function createCaller(userId: string) {
  const authorization = JwtService.sign({ userId });
  return appRouter.createCaller({
    [contextSymbol]: 'AuthenticatedContext',
    authorization,
    userId,
    path: '/trpc',
    uuid: '',
    method: '',
  });
}

export function createUnauthorizedCaller() {
  return appRouter.createCaller({ [contextSymbol]: 'UnauthenticatedContext', path: '/trpc', uuid: '', method: '' });
}
