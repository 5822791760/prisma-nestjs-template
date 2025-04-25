import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Posts = {
    id: Generated<number>;
    title: string | null;
    details: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    createdBy: number | null;
};
export type Users = {
    id: Generated<number>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    email: string;
    password: string;
    lastSignedInAt: Timestamp | null;
};
export type DB = {
    posts: Posts;
    users: Users;
};
