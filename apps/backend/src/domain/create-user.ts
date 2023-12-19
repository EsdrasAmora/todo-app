import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { Database } from '../db/client';
import { Env } from '../env';
import { CryptoService } from '../shared/crypto';

export class CreateUser {
  static async execute(input: z.input<typeof this.schema>) {
    const sameEmailUser = await Database.selectFrom('users')
      .where('email', '=', input.email)
      .select('email')
      .executeTakeFirst();

    if (sameEmailUser) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Email already in use' });
    }

    const passwordSeed = CryptoService.createSalt();
    const hashedPassword = CryptoService.hashSaltPassword(input.password, passwordSeed);
    const result = await Database.insertInto('users')
      .values({ email: input.email, passwordSeed, hashedPassword })
      .returningAll()
      .executeTakeFirstOrThrow();

    return result;
  }

  static schema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(Env.PASSWORD_MIN_LENGTH)
      .superRefine((value, ctx) => {
        if (value.match(/\d/) === null) {
          ctx.addIssue({ code: 'custom', message: 'Must contain at least one digit' });
        }
        if (value.match(/[a-z]/) === null) {
          ctx.addIssue({ code: 'custom', message: 'Must contain at least one lowercase letter' });
        }
        if (value.match(/[A-Z]/) === null) {
          ctx.addIssue({ code: 'custom', message: 'Must contain at least one uppercase letter' });
        }
      }),
  });
}
