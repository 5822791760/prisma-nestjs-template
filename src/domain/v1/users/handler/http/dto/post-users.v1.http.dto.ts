import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { createZodResponse } from '@core/shared/http/http.standard';

// ===== body =====

const PostUsersV1Http = z.object({
  email: z.string().email(),
  password: z.string(),
});
export class PostUsersV1HttpDto extends createZodDto(PostUsersV1Http) {}

// ===== response =====

const PostUsersV1HttpData = z.object({});

export class PostUsersV1HttpResponse extends createZodResponse(
  PostUsersV1HttpData,
) {}
