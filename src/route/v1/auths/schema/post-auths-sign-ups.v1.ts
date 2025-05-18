// auths sign ups
import { z } from 'zod';

export const PostAuthsSignUpsV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const PostAuthsSignUpsV1Output = z.object({
  token: z.string(),
  lastSignedInAt: z.date(),
});

//
export type PostAuthsSignUpsV1Input = z.infer<typeof PostAuthsSignUpsV1Input>;
export type PostAuthsSignUpsV1Output = z.infer<typeof PostAuthsSignUpsV1Output>;
