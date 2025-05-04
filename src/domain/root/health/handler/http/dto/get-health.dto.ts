import { z } from 'zod';

import { createZodResponse } from '@core/shared/http/http.standard';

// ===== response =====
const GetHealthData = z.object({
  heap: z.string(),
  // rss: z.string(),
  // db: z.string(),
});

export class GetHealthResponse extends createZodResponse(GetHealthData) {}
