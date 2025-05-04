import { z } from 'zod';

import { zodResponse } from '@core/shared/common/common.zod';

// ===== response =====
const GetHealthData = z.object({
  heap: z.string(),
  // rss: z.string(),
  // db: z.string(),
});

export class GetHealthResponse extends zodResponse(GetHealthData) {}
