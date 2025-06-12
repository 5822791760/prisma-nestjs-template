import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';

export const PostAuthsSignInsV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type PostAuthsSignInsV1Input = z.infer<typeof PostAuthsSignInsV1Input>;

export class PostAuthsSignInsV1Dto extends zodDto(PostAuthsSignInsV1Input) {}
