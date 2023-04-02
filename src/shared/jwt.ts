import { verify, sign } from 'jsonwebtoken';
import { Env } from '../env';
import { z } from 'zod';

export class JwtService {
  private static readonly BEARER: string = 'Bearer';
  private static readonly jwtSchema = z.object({
    userId: z.string().uuid(),
    iat: z.number().int(),
    exp: z.number().int(),
  });

  static verify(token: string) {
    try {
      const splitToken = token.replace(this.BEARER, '');
      return this.jwtSchema.parse(verify(splitToken, Env.JWT_SECRET));
    } catch (err) {
      console.debug('Invalid JWT token', err.message);
    }
    return null;
  }

  static sign(payload: unknown): string {
    const token = sign({ data: payload }, Env.JWT_SECRET, { expiresIn: Env.JWT_EXPIRATION_TIME });
    return `${this.BEARER} ${token}`;
  }
}
