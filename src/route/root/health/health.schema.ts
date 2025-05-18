import { z } from 'zod';

export const GetHealthOutput = z.object({
  heap: z.string(),
  // rss: z.string(),
  // db: z.string(),
});
export type GetHealthOutput = z.infer<typeof GetHealthOutput>;
