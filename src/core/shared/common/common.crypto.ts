import * as bcrypt from 'bcrypt';
import { TokenExpiredError, sign, verify } from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';

import { UserClaims } from '@core/middleware/jwt/jwt.common';

import myDayjs from './common.dayjs';
import { Err, Ok, Res } from './common.neverthrow';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

interface DecodedJwt<T> {
  status: string;
  data: {
    message: T;
    exp?: number | undefined;
    iat?: number | undefined;
  } | null;
}

export interface EncodeJwtOptions {
  noExpire?: boolean;
}
function encodeJwt(
  obj: Record<string, any>,
  salt: string,
  opts?: EncodeJwtOptions,
) {
  return sign({ message: obj }, salt, {
    expiresIn: opts?.noExpire ? '100y' : '1h',
  });
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

export function encodeUserJwt(
  user: UserClaims,
  salt: string,
  opts?: EncodeJwtOptions,
) {
  return encodeJwt(user, salt, opts);
}

export function decodeUserJwt(token: string, salt: string) {
  return decodeJwt<UserClaims>(token, salt);
}

export function generateUID() {
  const now = myDayjs();

  const yy = now.format('YY');
  const ddd = now.dayOfYear().toString().padStart(3, '0');
  const secondsSinceMidnight = (
    now.hour() * 3600 +
    now.minute() * 60 +
    now.second()
  )
    .toString()
    .padStart(5, '0');

  return `${yy}${ddd}${secondsSinceMidnight}${nanoid()}`;
}
