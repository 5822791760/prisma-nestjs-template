import * as bcrypt from 'bcrypt';
import { TokenExpiredError, sign, verify } from 'jsonwebtoken';

import { UserClaims } from '@core/middleware/jwt/jwt.common';

import { Err, Ok, Res } from './common.neverthrow';

interface DecodedJwt<T> {
  status: string;
  data: {
    message: T;
    exp?: number | undefined;
    iat?: number | undefined;
  } | null;
}

function encodeJwt(obj: Record<string, any>, salt: string) {
  return sign({ message: obj }, salt, { expiresIn: '1h' });
}

function decodeJwt<T>(
  token: string,
  salt: string,
): Res<DecodedJwt<T>['data'], 'expire' | 'invalid'> {
  try {
    const data = verify(token, salt) as DecodedJwt<T>['data'];
    return Ok(data);
  } catch (errs) {
    if (errs instanceof TokenExpiredError) {
      return Err('expire');
    }

    return Err('invalid');
  }
}

export function hashString(data: string) {
  const hashed = bcrypt.hashSync(data, 10);
  return hashed;
}

export function isMatchedHash(raw: string, hashed: string) {
  const isMatch = bcrypt.compareSync(raw, hashed);
  return isMatch;
}

export function encodeUserJwt(user: UserClaims, salt: string) {
  return encodeJwt(user, salt);
}

export function decodeUserJwt(token: string, salt: string) {
  return decodeJwt<UserClaims>(token, salt);
}
