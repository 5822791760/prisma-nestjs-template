import { Posts } from '@core/db/prisma';

export interface PostData extends Omit<Posts, 'id'> {}
export interface NewPostData {
  title: string;
  details: string;
  createdBy: number;
}
