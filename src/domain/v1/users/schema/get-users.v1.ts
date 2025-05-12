import { z } from 'zod';

export const GetUsersV1Input = z.object({
  page: z.coerce.number(),
  perPage: z.coerce.number(),
});

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

//
export type GetUsersV1Input = z.infer<typeof GetUsersV1Input>;
export type GetUsersV1Output = z.infer<typeof GetUsersV1Output>;
