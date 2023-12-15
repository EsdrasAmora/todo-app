import crypto from 'crypto';

import { Env } from '../env';

export class CryptoService {
  static createSalt() {
    return crypto.randomBytes(Env.CRYPTO_DEFAULT_PASSWORD_LENGTH).toString('hex');
  }
  static hashSaltPassword(password: string, salt: string) {
    return crypto.scryptSync(password + salt, Env.SECRET_PASSWORD_SALT, 64).toString('base64');
  }
}
