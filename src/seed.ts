import { faker } from '@faker-js/faker';
import { TodoEntity, UserEntity } from './db/schema';

async function seed() {
  const { setupEnv } = await import('./env');
  setupEnv('test.env');
  const { DbClient } = await import('./db/client');
  const { CryptoService } = await import('./shared/crypto');

  const users = await DbClient.insert(UserEntity)
    .values(
      [...new Array(5)].map(() => {
        const password = faker.internet.password();
        const salt = CryptoService.createSalt();
        return {
          email: faker.internet.email(),
          hashedPassword: CryptoService.hashSaltPassword(password, salt),
          passwordSeed: salt,
        };
      }),
    )
    .returning();

  await DbClient.insert(TodoEntity)
    .values(
      [...new Array(40)].map(() => ({
        userId: faker.helpers.arrayElement(users).id,
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
      })),
    )
    .execute();
}

void seed();
