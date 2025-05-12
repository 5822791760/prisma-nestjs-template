import { z } from 'zod';

export const PostUsersV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});
export const PostUsersV1Output = z.object({});

//
export type PostUsersV1Input = z.infer<typeof PostUsersV1Input>;
export type PostUsersV1Output = z.infer<typeof PostUsersV1Output>;
