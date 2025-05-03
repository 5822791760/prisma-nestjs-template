type ImmutablePrimitive =
  | undefined
  | null
  | boolean
  | string
  | number
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function;

export type Read<T> = T extends ImmutablePrimitive
  ? T
  : T extends Array<infer U>
    ? ReadArray<U>
    : T extends Map<infer K, infer V>
      ? ReadMap<K, V>
      : T extends Set<infer M>
        ? ReadSet<M>
        : ReadObject<T>;

export type ReadArray<T> = ReadonlyArray<Read<T>>;
export type ReadMap<K, V> = ReadonlyMap<Read<K>, Read<V>>;
export type ReadSet<T> = ReadonlySet<Read<T>>;
export type ReadObject<T> = { readonly [K in keyof T]: Read<T[K]> };
