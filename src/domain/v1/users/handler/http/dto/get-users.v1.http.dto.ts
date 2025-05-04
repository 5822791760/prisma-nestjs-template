import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';
import { getPaginationZod } from '@core/shared/common/common.zod';
import { zodResponse } from '@core/shared/common/common.zod';

// === request ===

const GetUsersV1Http = z.object({
  page: z.coerce.number(),
  perPage: z.coerce.number(),
});
export class GetUsersV1HttpDto extends zodDto(GetUsersV1Http) {}

// === response ===

const GetUsersV1HttpData = z.object({
  id: z.number(),
  email: z.string(),
  createdAt: z.date(),
});

export class GetUsersV1HttpResponse extends zodResponse(
  GetUsersV1HttpData,
  getPaginationZod(),
) {}
