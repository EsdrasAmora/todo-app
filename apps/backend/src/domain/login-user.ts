import { z } from 'zod';
import { DbClient } from '../db/client';
import { JwtService } from '../shared/jwt';
import { TRPCError } from '@trpc/server';
import { CryptoService } from '../shared/crypto';
import { UserEntity } from '../db/schema';
import { eq } from 'drizzle-orm';

export class LoginUser {
  static schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  static async execute(input: z.input<typeof this.schema>) {
    const user = await DbClient.query.UserEntity.findFirst({ where: eq(UserEntity.email, input.email) });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    if (CryptoService.hashSaltPassword(input.password, user.passwordSeed) !== user.hashedPassword) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid credentials' });
    }
    return { authorization: JwtService.sign({ userId: user.id }) };
  }
}
