import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';
import { zodResponse } from '@core/shared/common/common.zod';

// ===== body =====

const PostUsersV1Http = z.object({
  email: z.string().email(),
  password: z.string(),
});
export class PostUsersV1HttpDto extends zodDto(PostUsersV1Http) {}

// ===== response =====

const PostUsersV1HttpData = z.object({});

export class PostUsersV1HttpResponse extends zodResponse(PostUsersV1HttpData) {}
