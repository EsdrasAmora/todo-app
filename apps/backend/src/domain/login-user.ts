import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { Context } from '../context';
import { Database } from '../db';
import { CryptoService } from '../shared/crypto';
import { JwtService } from '../shared/jwt';

export class LoginUser {
  static schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  static async execute(input: z.input<typeof this.schema>, { setCookie }: Context) {
    const user = await Database.selectFrom('users').selectAll().where('email', '=', input.email).executeTakeFirst();
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    if (CryptoService.hashSaltPassword(input.password, user.passwordSeed) !== user.hashedPassword) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid credentials' });
    }
    const token = JwtService.sign({ userId: user.id });
    setCookie('authorization', token);
    return { authorization: token };
  }
}
