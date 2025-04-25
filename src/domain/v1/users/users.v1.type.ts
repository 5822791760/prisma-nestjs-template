// Model

export interface NewUserData {
  email: string;
  password: string;
}
export interface UpdateUserData extends Partial<NewUserData> {}
export interface NewUser extends NewUserData {
  createdAt: Date;
  updatedAt: Date;
}

// Usage

export interface ValidateUserData {
  email: string;
}

export interface UserDetails {
  id: number;
  email: string;
  createdAt: Date;
}
