import { Users } from '@core/db/entities/Users';

// Model
export interface NewUserData {
  email: string;
  password: string;
}
export interface NewUser extends NewUserData {
  createdAt: Date;
  updatedAt: Date;
  lastSignedInAt: Date;
}
export interface AuthenticatedUser extends Omit<Users, 'lastSignedInAt'> {
  lastSignedInAt: Date;
}

// Usage

export interface UserData extends Partial<Pick<Users, 'lastSignedInAt'>> {}

export interface SignInUserData extends Pick<Users, 'email' | 'password'> {}

export interface ValidateSignUpData extends Pick<NewUserData, 'email'> {}

export interface AuthDetails {
  token: string;
  lastSignedInAt: Date;
}
