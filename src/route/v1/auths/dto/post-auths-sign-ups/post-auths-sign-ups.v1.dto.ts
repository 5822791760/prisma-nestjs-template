import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';

export const PostAuthsSignUpsV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type PostAuthsSignUpsV1Input = z.infer<typeof PostAuthsSignUpsV1Input>;

export class PostAuthsSignUpsV1Dto extends zodDto(PostAuthsSignUpsV1Input) {}
