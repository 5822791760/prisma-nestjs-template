import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';

export const PostAuthsSignUpV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type PostAuthsSignUpV1Input = z.infer<typeof PostAuthsSignUpV1Input>;

export class PostAuthsSignUpV1Dto extends zodDto(PostAuthsSignUpV1Input) {}
