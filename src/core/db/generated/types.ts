import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Posts = {
    id: Generated<number>;
    title: string | null;
    details: Generated<string>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    created_by: number | null;
};
export type Users = {
    id: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    email: string;
    password: string;
    last_signed_in_at: Timestamp | null;
};
export type DB = {
    posts: Posts;
    users: Users;
};
