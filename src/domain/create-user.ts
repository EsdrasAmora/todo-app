import { z } from 'zod';
import { prisma } from '../db/client';

export class CreateUser {
  static schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  static execute(input: z.input<typeof this.schema>) {
    return prisma.user.create({ data: input as any });
  }
}
