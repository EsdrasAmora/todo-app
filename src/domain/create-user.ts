import { z } from 'zod';
import { prisma } from '../db/client';
import { TRPCError } from '@trpc/server';
import { Env } from '../env';
import { CryptoService } from '../shared/crypto';

export class CreateUser {
  static async execute(input: z.input<typeof this.schema>) {
    const sameEmailUser = await prisma.user.findUnique({ where: { email: input.email } });

    if (sameEmailUser) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Email already in use' });
    }

    const passwordSalt = CryptoService.createSalt();
    const hashedPassword = CryptoService.hashSaltPassword(input.password, passwordSalt);

    return prisma.user.create({ data: { email: input.email, hashedPassword, passwordSalt } });
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
