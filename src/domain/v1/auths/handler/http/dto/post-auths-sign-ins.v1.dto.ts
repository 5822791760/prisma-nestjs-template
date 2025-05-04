import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';
import { zodResponse } from '@core/shared/common/common.zod';

// ====== body =======

const PostAuthsSignInsV1Http = z.object({
  email: z.string().email(),
  password: z.string(),
});
export class PostAuthsSignInsV1HttpDto extends zodDto(PostAuthsSignInsV1Http) {}

// ===== response =====

const PostAuthsSignInsV1HttpData = z.object({
  token: z.string(),
  lastSignedInAt: z.date(),
});

export class PostAuthsSignInsV1HttpResponse extends zodResponse(
  PostAuthsSignInsV1HttpData,
) {}
