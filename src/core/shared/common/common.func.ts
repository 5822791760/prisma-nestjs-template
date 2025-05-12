import { faker } from '@faker-js/faker';

import { Read } from './common.type';

export function isProd(env: string) {
  return env === 'prod';
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
