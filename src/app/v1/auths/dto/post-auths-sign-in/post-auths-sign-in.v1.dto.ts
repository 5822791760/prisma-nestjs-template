import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';

export const PostAuthsSignInV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type PostAuthsSignInV1Input = z.infer<typeof PostAuthsSignInV1Input>;

export class PostAuthsSignInV1Dto extends zodDto(PostAuthsSignInV1Input) {}
