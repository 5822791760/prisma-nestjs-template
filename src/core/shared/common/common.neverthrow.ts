import { Err as IErr, Result, err, ok } from 'neverthrow';

export type ValidateFields<T> = Record<keyof T, any>;

export interface Info<K> {
  key: K;
  context: Record<string, string>;
  fields: Record<string, any>;
}
export function newInfo<K extends string>(
  key: K,
  options?: {
    context?: Record<string, string>;
    fields?: Record<string, any>;
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
  return !Object.keys(v).length;
}

export type Res<T, E> = Result<T, Info<E>>;
export const Ok = ok;
export function Err<K extends string>(
  key: K,
  options?: {
    context?: Record<string, string>;
    fields?: Record<string, any>;
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
      message: e?.message || 'noMessage',
      stack: e?.stack || '',
    },
  });
}

export function errIs<E extends Info<string>, K extends E['key']>(
  e: E,
  key: K,
): boolean {
  return e.key === key;
}
