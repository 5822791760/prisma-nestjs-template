import { z } from 'zod';

export const GetUsersIdV1Output = z.object({
  id: z.number(),
  email: z.string(),
  createdAt: z.date(),
});

//
export type GetUsersIdV1Output = z.infer<typeof GetUsersIdV1Output>;
