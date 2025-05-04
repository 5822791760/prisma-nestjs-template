import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { createZodResponse } from '@core/shared/http/http.standard';

// ====== body =======

const PostAuthsSignUpsV1Http = z.object({
  email: z.string().email(),
  password: z.string(),
});
export class PostAuthsSignUpsV1HttpDto extends createZodDto(
  PostAuthsSignUpsV1Http,
) {}

// ===== response =====

const PostAuthsSignUpsV1HttpData = z.object({
  token: z.string(),
  lastSignedInAt: z.date(),
});

export class PostAuthsSignUpsHttpResponse extends createZodResponse(
  PostAuthsSignUpsV1HttpData,
) {}
