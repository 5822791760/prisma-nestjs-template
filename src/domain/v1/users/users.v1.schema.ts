import { z } from 'zod';

// get users details
export const GetUserDetailsV1Output = z.object({
  id: z.number(),
  email: z.string(),
  createdAt: z.date(),
});
export type GetUserDetailsV1Output = z.infer<typeof GetUserDetailsV1Output>;

// get users
export const GetUsersV1Input = z.object({
  page: z.coerce.number(),
  perPage: z.coerce.number(),
});
export type GetUsersV1Input = z.infer<typeof GetUsersV1Input>;

export const GetUsersV1OutputData = z.array(
  z.object({
    id: z.number(),
    email: z.string(),
    createdAt: z.date(),
  }),
);
export const GetUsersV1Output = z.object({
  data: GetUsersV1OutputData,
  totalItems: z.number(),
});
export type GetUsersV1Output = z.infer<typeof GetUsersV1Output>;

// post users
export const PostUsersV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type PostUsersV1Input = z.infer<typeof PostUsersV1Input>;

export const PostUsersV1Output = z.object({});
export type PostUsersV1Output = z.infer<typeof PostUsersV1Output>;

// put users
export const PutUserDetailsV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type PutUserDetailsV1Input = z.infer<typeof PutUserDetailsV1Input>;

export const PutUserDetailsV1Output = z.object({});
export type PutUserDetailsV1Output = z.infer<typeof PutUserDetailsV1Output>;
