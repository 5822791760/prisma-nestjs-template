import { faker } from '@faker-js/faker';
import * as path from 'path';

import { Err, Ok, Res } from './common.neverthrow';
import { Read } from './common.type';

export function isProd(env: string) {
  return env === 'prod';
}

export function isTesting(env: string) {
  return env === 'test';
}

export function isLocal(env: string) {
  return env === 'local';
}

export function getRandomId(objs: { id: number }[]) {
  const randomNum = faker.number.int(objs.length - 1);
  return objs[randomNum].id;
}

export function clone<T>(obj: Read<T>): T {
  return structuredClone(obj) as T;
}

export function isEmptyObject(obj: object) {
  if (!obj) {
    return true;
  }

  return !Object.keys(obj).length;
}

export function validateCsvFile(
  file: Express.Multer.File,
): Res<null, 'noFile' | 'tooLarge' | 'invalidType' | 'invalidExt'> {
  if (!file) {
    return Err('noFile');
  }

  // Size check
  if (file.size > 500 * 1024 * 1024) {
    return Err('tooLarge'); // 500 MB
  }

  // Mimetype check (best effort, not 100% reliable)
  if (
    file.mimetype !== 'text/csv' &&
    file.mimetype !== 'application/vnd.ms-excel'
  ) {
    return Err('invalidType');
  }

  // Extension check (fallback to ensure `.csv`)
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.csv') {
    return Err('invalidExt');
  }

  return Ok(null);
}
