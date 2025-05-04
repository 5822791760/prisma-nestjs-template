import { z } from 'zod';

// auths sign ins
export const PostAuthsSignInsV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type PostAuthsSignInsV1Input = z.infer<typeof PostAuthsSignInsV1Input>;

export const PostAuthsSignInsV1Output = z.object({
  token: z.string(),
  lastSignedInAt: z.date(),
});
export type PostAuthsSignInsV1Output = z.infer<typeof PostAuthsSignInsV1Output>;

// auths sign ups
export const PostAuthsSignUpsV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type PostAuthsSignUpsV1Input = z.infer<typeof PostAuthsSignUpsV1Input>;

export const PostAuthsSignUpsV1Output = z.object({
  token: z.string(),
  lastSignedInAt: z.date(),
});
export type PostAuthsSignUpsV1Output = z.infer<typeof PostAuthsSignUpsV1Output>;
