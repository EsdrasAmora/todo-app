import { z } from 'zod';
import { prisma } from '../db/client';

export class LoginUser {
  static schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  static async execute(input: z.input<typeof this.schema>) {
    const _user = prisma.user.findUnique({ where: { email: input.email } });

    return { authorization: 'authorization token' };
  }
}
