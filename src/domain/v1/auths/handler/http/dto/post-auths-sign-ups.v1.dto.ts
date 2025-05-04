import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';
import { zodResponse } from '@core/shared/common/common.zod';

// ====== body =======

const PostAuthsSignUpsV1Http = z.object({
  email: z.string().email(),
  password: z.string(),
});
export class PostAuthsSignUpsV1HttpDto extends zodDto(PostAuthsSignUpsV1Http) {}

// ===== response =====

const PostAuthsSignUpsV1HttpData = z.object({
  token: z.string(),
  lastSignedInAt: z.date(),
});

export class PostAuthsSignUpsHttpResponse extends zodResponse(
  PostAuthsSignUpsV1HttpData,
) {}
