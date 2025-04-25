import { Err as IErr, Result, err, ok } from 'neverthrow';

import { FieldsErrorKey } from '../http/http.standard';

export type ValidateFields<T> = Record<keyof T, FieldsErrorKey[]>;

export interface Info<K> {
  key: K;
  context: Record<string, string>;
  fields: Record<string, string[]>;
}
export function newInfo<K extends string>(
  key: K,
  options?: {
    context?: Record<string, string>;
    fields?: Record<string, string[]>;
  },
): Info<K> {
  return {
    key,
    context: options?.context ?? {},
    fields: options?.fields ?? {},
  };
}

export function validateSuccess<T extends ValidateFields<Record<string, any>>>(
  v: T,
) {
  return !Object.values(v).some((arr) => !!arr.length);
}

export type Res<T, E> = Result<T, Info<E>>;
export const Ok = ok;
export function Err<K extends string>(
  key: K,
  options?: {
    context?: Record<string, string>;
    fields?: Record<string, string[]>;
  },
): IErr<any, Info<K>> {
  return err({
    key,
    context: options?.context ?? {},
    fields: options?.fields ?? {},
  });
}
export function ExceptionErr<K extends string>(key: K, e: Error) {
  return Err(key, {
    context: {
      message: e.message,
      stack: e.stack || '',
    },
  });
}

export function errIs<E extends Info<string>, K extends E['key']>(
  e: E,
  key: K,
): boolean {
  return e.key === key;
}
