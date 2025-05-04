import { z } from 'zod';

import { zodResponse } from '@core/shared/common/common.zod';

// === response ===
const GetUserDetailsV1HttpData = z.object({
  id: z.number(),
  email: z.string(),
  createdAt: z.date(),
});

export class GetUserDetailsV1HttpResponse extends zodResponse(
  GetUserDetailsV1HttpData,
) {}
