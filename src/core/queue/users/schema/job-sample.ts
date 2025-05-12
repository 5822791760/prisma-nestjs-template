import { z } from 'zod';

export const JobSampleInput = z.object({
  key: z.string(),
});
export type JobSampleInput = z.infer<typeof JobSampleInput>;
