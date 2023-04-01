import { z } from 'zod';
import { prisma } from '../db/client';

export class LoginUser {
  static schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  static async execute(input: z.input<typeof this.schema>) {
    const user = prisma.user.create({ data: input as any });

    return user;
  }
}
