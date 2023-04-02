import { z } from 'zod';
import { prisma } from '../db/client';
import { JwtService } from '../shared/jwt';
import { TRPCError } from '@trpc/server';
import { CryptoService } from '../shared/crypto';

export class LoginUser {
  static schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  static async execute(input: z.input<typeof this.schema>) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    if (CryptoService.hashSaltPassword(input.password, user.passwordSalt) !== user.hashedPassword) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid credentials' });
    }
    return { authorization: JwtService.sign({ userId: user.id }) };
  }
}
