import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { createZodResponse } from '@core/shared/http/http.standard';

// ====== body =======

const PostAuthsSignInsV1Http = z.object({
  email: z.string().email(),
  password: z.string(),
});
export class PostAuthsSignInsV1HttpDto extends createZodDto(
  PostAuthsSignInsV1Http,
) {}

// ===== response =====

const PostAuthsSignInsV1HttpData = z.object({
  token: z.string(),
  lastSignedInAt: z.date(),
});

export class PostAuthsSignInsV1HttpResponse extends createZodResponse(
  PostAuthsSignInsV1HttpData,
) {}
