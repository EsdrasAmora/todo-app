import { faker } from '@faker-js/faker';

import { Database, Sql } from '../db/client';
import { CryptoService } from '../shared/crypto';

console.info('Seeding database');
let flag = false;
const users = await Database.insertInto('users')
  .values(
    [...new Array(5)].map(() => {
      const password = faker.internet.password();
      const salt = CryptoService.createSalt();
      const email = faker.internet.email();
      if (!flag) {
        console.log(password, email);
        flag = true;
      }
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
