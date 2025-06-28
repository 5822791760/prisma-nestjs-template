import { Nilable } from './common.type';

export function isNull(value: any) {
  if (value === null) {
    return true;
  }

  return false;
}

export function isNil(value: Nilable): value is null | undefined {
  if (value === undefined) {
    return true;
  }

  if (value === null) {
    return true;
  }

  if (value === '') {
    return true;
  }

  return false;
}

export function isCsvNil(value: Nilable): value is null | undefined {
  if (value === '-') {
    return true;
  }

  return isNil(value);
}

export function isNotNil(value: Nilable) {
  return !isNil(value);
}

export function isAnyValidFunc<T>(...funcs: ((value: T) => boolean)[]) {
  return function validate(v: T) {
    for (const func of funcs) {
      const res = func(v);
      if (res === true) {
        return true;
      }
    }

    return false;
  };
}

export function isAllValidFunc<T>(...funcs: ((value: T) => boolean)[]) {
  return (v: T) => {
    for (const func of funcs) {
      const res = func(v);
      if (res === false) {
        return false;
      }
    }

    return true;
  };
}

export function isNumericString(value: string | null): boolean {
  if (isNil(value)) {
    return false;
  }

  return /^-?\d+(\.\d+)?$/.test(value.trim());
}

export function isEmail(value: string | null): boolean {
  if (isNil(value)) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isISOString(value: string | null): boolean {
  if (isNil(value)) {
    return false;
  }

  try {
    new Date(value);
    return true;
  } catch {
    return false;
  }
}
