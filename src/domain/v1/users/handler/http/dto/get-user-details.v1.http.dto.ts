import { z } from 'zod';

import { createZodResponse } from '@core/shared/http/http.standard';

// === response ===
const GetUserDetailsV1HttpData = z.object({
  id: z.number(),
  email: z.string(),
  createdAt: z.date(),
});

export class GetUserDetailsV1HttpResponse extends createZodResponse(
  GetUserDetailsV1HttpData,
) {}
