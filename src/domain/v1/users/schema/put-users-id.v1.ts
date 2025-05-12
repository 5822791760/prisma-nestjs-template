import { z } from 'zod';

export const PutUsersIdV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});
export const PutUsersIdV1Output = z.object({});

//
export type PutUsersIdV1Input = z.infer<typeof PutUsersIdV1Input>;
export type PutUsersIdV1Output = z.infer<typeof PutUsersIdV1Output>;
