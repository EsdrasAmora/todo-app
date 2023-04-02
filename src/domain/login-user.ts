import { z } from 'zod';
import { prisma } from '../db/client';
import { JwtService } from '../jwt';
import { TRPCError } from '@trpc/server';

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
    return { authorization: JwtService.sign({ userId: user.id }) };
  }
}
