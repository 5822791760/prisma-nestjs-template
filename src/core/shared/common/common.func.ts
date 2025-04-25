import { faker } from '@faker-js/faker';

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

export function clone<T>(obj: T): T {
  return structuredClone(obj);
}

export function isEmptyObject(obj: object) {
  return !Object.keys(obj).length;
}
