export interface UserData {
  email: string;
  password: string;
}

export interface NewUser extends PostData {
  createdAt: Date;
  updatedAt: Date;
}

export interface PostData {
  title: string;
  details: string;
  createdBy: number;
}

export interface NewPost extends PostData {
  createdAt: Date;
  updatedAt: Date;
}
