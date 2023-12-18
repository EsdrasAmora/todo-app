import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { DbClient } from '../db/client';
import { UserEntity } from '../db/schema';
import { Env } from '../env';
import { CryptoService } from '../shared/crypto';

export class CreateUser {
  static async execute(input: z.input<typeof this.schema>) {
    const sameEmailUser = await DbClient.query.UserEntity.findFirst({ where: eq(UserEntity.email, input.email) });

    if (sameEmailUser) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Email already in use' });
    }

    const passwordSeed = CryptoService.createSalt();
    const hashedPassword = CryptoService.hashSaltPassword(input.password, passwordSeed);

    const [result] = await DbClient.insert(UserEntity)
      .values({ email: input.email, passwordSeed, hashedPassword })
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result!;
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
