import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { createZodResponse } from '@core/shared/http/http.standard';

// ===== body =====

const PutUserDetailsV1Http = z.object({
  email: z.string().email(),
  password: z.string(),
});
export class PutUserDetailsV1HttpDto extends createZodDto(
  PutUserDetailsV1Http,
) {}

// ===== response =====

const PutUserDetailsV1HttpData = z.object({});
export class PutUserDetailsV1HttpResponse extends createZodResponse(
  PutUserDetailsV1HttpData,
) {}
