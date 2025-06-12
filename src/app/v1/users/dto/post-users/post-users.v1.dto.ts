import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';

export const PostUsersV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type PostUsersV1Input = z.infer<typeof PostUsersV1Input>;

export class PostUsersV1Dto extends zodDto(PostUsersV1Input) {}
