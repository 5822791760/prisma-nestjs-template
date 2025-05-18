// Model
import { Users } from '@core/db/prisma';

export interface UserData extends Omit<Users, 'id'> {}
export interface NewUserData {
  email: string;
  password: string;
}

export interface UpdateUserData extends Partial<UserData> {}

// Usage

export type SignedIn<T> = Omit<T, 'lastSignedInAt'> & { lastSignedInAt: Date };

export interface ValidateUserData {
  email: string;
}
