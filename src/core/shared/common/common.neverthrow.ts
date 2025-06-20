import { Err as IErr, Result, err, ok } from 'neverthrow';
import { ZodError } from 'zod';

function setNestedKey(
  target: Record<string, any>,
  path: (string | number)[],
  message: string,
): void {
  let curr = target;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];

    if (i === path.length - 1) {
      curr[key] = [message];
    } else {
      curr[key] ||= {};
      curr = curr[key];
    }
  }
}

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
  return !Object.values(v).some((arr) => !!arr.length);
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

export function ExceptionZod<K extends string>(key: K, zodErr: ZodError) {
  const fields = {};
  for (const err of zodErr.errors) {
    setNestedKey(fields, err.path, err.message);
  }
  return Err(key, {
    fields,
    context: {
      message: zodErr?.message || 'noMessage',
      stack: zodErr?.stack || '',
    },
  });
}

export function errIs<E extends Info<string>, K extends E['key']>(
  e: E,
  key: K,
): boolean {
  return e.key === key;
}
