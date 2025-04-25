export interface PostData {
  title: string;
  details: string;
  createdBy: { id: number };
}

export interface NewPost extends PostData {
  createdAt: Date;
  updatedAt: Date;
}
