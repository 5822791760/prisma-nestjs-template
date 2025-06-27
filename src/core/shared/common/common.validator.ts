type Nil = unknown | undefined | null | string;
export function isNil(value: Nil): value is null | undefined {
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

export function isNotNil(value: Nil) {
  return !isNil(value);
}

export function chainTilValid<T>(...funcs: ((value: T) => boolean)[]) {
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

export function chainTilInvalid<T>(...funcs: ((value: T) => boolean)[]) {
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

export function isNumericString(value: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(value.trim());
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
