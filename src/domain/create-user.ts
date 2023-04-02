import { z } from 'zod';
import { prisma } from '../db/client';
import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
import { Env } from '../env';

export class CreateUser {
  static async execute(input: z.input<typeof this.schema>) {
    const sameEmailUser = await prisma.user.findUnique({ where: { email: input.email } });

    if (sameEmailUser) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Email already in use' });
    }

    const salt = crypto.randomBytes(Env.CRYPTO_DEFAULT_PASSWORD_LENGTH).toString('hex');
    const hashedPassword = crypto.scryptSync(input.password + salt, Env.SECRET_PASSWORD_SALT, 64).toString('base64');

    return prisma.user.create({ data: { email: input.email, hashedPassword: hashedPassword, passwordSalt: salt } });
  }

  static schema = z.object({
    email: z.string().email(),
    password: z.string().superRefine((value, ctx) => {
      if (value.length < Env.PASSWORD_MIN_LENGTH) {
        ctx.addIssue({ code: 'too_small', minimum: Env.PASSWORD_MIN_LENGTH, type: 'string', inclusive: true });
      }
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
