import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { getPaginationZod } from '@core/shared/http/http.response.dto';
import { createZodResponse } from '@core/shared/http/http.standard';

// === request ===

const GetUsersV1Http = z.object({
  page: z.coerce.number(),
  perPage: z.coerce.number(),
});
export class GetUsersV1HttpDto extends createZodDto(GetUsersV1Http) {}

// === response ===

const GetUsersV1HttpData = z.object({
  id: z.number(),
  email: z.string(),
  createdAt: z.date(),
});

export class GetUsersV1HttpResponse extends createZodResponse(
  GetUsersV1HttpData,
  getPaginationZod(),
) {}
