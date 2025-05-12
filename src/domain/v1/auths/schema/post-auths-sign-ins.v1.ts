// auths sign ins
import { z } from 'zod';

export const PostAuthsSignInsV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const PostAuthsSignInsV1Output = z.object({
  token: z.string(),
  lastSignedInAt: z.date(),
});

//
export type PostAuthsSignInsV1Input = z.infer<typeof PostAuthsSignInsV1Input>;
export type PostAuthsSignInsV1Output = z.infer<typeof PostAuthsSignInsV1Output>;
