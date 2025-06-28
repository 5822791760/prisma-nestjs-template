import * as bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { TokenExpiredError, sign, verify } from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';

import { config } from '@core/config';
import { UserClaims } from '@core/middleware/jwt/jwt.common';

import myDayjs from './common.dayjs';
import { Err, ExceptionErr, Ok, Res } from './common.neverthrow';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
const encryptkey = Buffer.from(config().crypto.aesKey, 'base64');
const jwtConfig = config().jwt;
const encryptAlgo = 'aes-256-gcm';

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

export function encodeUserJwt(user: UserClaims) {
  return encodeJwt({ id: user.id }, jwtConfig.salt, {
    noExpire: jwtConfig.noExpire,
  });
}

export function decodeUserJwt(token: string, salt: string) {
  return decodeJwt<UserClaims>(token, salt);
}

export function encryptMessage(text: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(encryptAlgo, encryptkey, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decryptMessage(
  encryptedBase64: string,
): Res<string, 'invalid'> {
  try {
    const data = Buffer.from(encryptedBase64, 'base64');
    const iv = data.subarray(0, 12);
    const tag = data.subarray(12, 28);
    const encrypted = data.subarray(28);

    const decipher = createDecipheriv(encryptAlgo, encryptkey, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return Ok(decrypted.toString('utf8'));
  } catch (e: any) {
    return ExceptionErr('invalid', e);
  }
}

export function encryptObject(obj: Record<string, any>): string {
  return encryptMessage(JSON.stringify(obj));
}

export function decryptObject<T>(encrypted: string): Res<T, 'invalid'> {
  const rDecrypted = decryptMessage(encrypted);
  if (rDecrypted.isErr()) {
    return Err('invalid', rDecrypted.error);
  }

  return Ok(JSON.parse(rDecrypted.value));
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
