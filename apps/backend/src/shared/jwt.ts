import jsonToken from 'jsonwebtoken';
import { z } from 'zod';

import { Env } from '../env';

export class JwtService {
  private static readonly jwtSchema = z.object({
    data: z.object({ userId: z.string().uuid() }),
    iat: z.number().int(),
    exp: z.number().int(),
  });

  static verify(token: string) {
    try {
      const splitToken = token.split(' ')[1];
      return this.jwtSchema.parse(jsonToken.verify(splitToken ?? '', Env.JWT_SECRET));
    } catch (_err) {
      //check TokenExpiredError
      /* empty */
    }
    return null;
  }

  static sign(payload: object): string {
    const token = jsonToken.sign({ data: payload }, Env.JWT_SECRET, { expiresIn: Env.JWT_EXPIRATION_TIME });
    return `Bearer ${token}`;
  }
}
