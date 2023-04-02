import { appRouter } from '../presentation/router';
import { contextSymbol } from '../presentation/trpc.context';
import { JwtService } from '../shared/jwt';
import { prisma } from '../db/client';
import { faker } from '@faker-js/faker';

export function createUser() {
  return prisma.user.create({
    data: { email: faker.internet.email(), hashedPassword: 'anything', passwordSalt: 'anything' },
  });
}

export function createTodo(userId: string) {
  const createdAt = faker.date.past();
  return prisma.todo.create({
    data: {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      userId,
      updatedAt: new Date(createdAt.getTime() + 10 * 60 * 1000),
      createdAt,
    },
  });
}

export async function createCaller(userId: string) {
  const authorization = JwtService.sign({ userId });
  return appRouter.createCaller({ authorization, [contextSymbol]: true });
}

export function createUnauthorizedCaller() {
  return appRouter.createCaller({ authorization: undefined, [contextSymbol]: true });
}
