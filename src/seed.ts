import { faker } from '@faker-js/faker';

async function seed() {
  const { setupEnv } = await import('./env');
  setupEnv('test.env');
  const { prisma } = await import('./db/client');
  const { CryptoService } = await import('./shared/crypto');

  await prisma.user.createMany({
    data: [...new Array(5)].map(() => {
      const password = faker.internet.password();
      const salt = CryptoService.createSalt();
      return {
        email: faker.internet.email(),
        hashedPassword: CryptoService.hashSaltPassword(password, salt),
        passwordSalt: salt,
      };
    }),
  });

  const users = await prisma.user.findMany({ select: { id: true } });

  await prisma.todo.createMany({
    data: [...new Array(40)].map(() => ({
      userId: faker.helpers.arrayElement(users).id,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
    })),
  });
}

void seed();
