import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { Database } from '../db/client';
import { CryptoService } from '../shared/crypto';
import { JwtService } from '../shared/jwt';

export class LoginUser {
  static schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  static async execute(input: z.input<typeof this.schema>) {
    const user = await Database.selectFrom('users').selectAll().where('email', '=', input.email).executeTakeFirst();
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    if (CryptoService.hashSaltPassword(input.password, user.passwordSeed) !== user.hashedPassword) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid credentials' });
    }
    return { authorization: JwtService.sign({ userId: user.id }) };
  }
}
