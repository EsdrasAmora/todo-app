import { faker } from '@faker-js/faker';

import { Database } from '../db';
import { CryptoService } from '../shared/crypto';

console.info('Seeding database');
const users = await Database.insertInto('users')
  .values(
    [...new Array(5)].map((_, i) => {
      const password = i === 0 ? 'ABCDabcd!@#$1234' : faker.internet.password();
      const salt = CryptoService.createSalt();
      const email = i === 0 ? 'test.taqtile@gmail.com' : faker.internet.email();
      return {
        email,
        hashedPassword: CryptoService.hashSaltPassword(password, salt),
        passwordSeed: salt,
      };
    }),
  )
  .returningAll()
  .execute();

await Database.insertInto('todos')
  .values(
    [...new Array(40)].map(() => ({
      userId: faker.helpers.arrayElement(users).id,
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
    })),
  )
  .execute();

// If you don't close the it will wait for the connection to timeout
await Database.destroy();
console.info('Database seeded successfully');
