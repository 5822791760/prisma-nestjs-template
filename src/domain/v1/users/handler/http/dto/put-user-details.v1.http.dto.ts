import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';
import { zodResponse } from '@core/shared/common/common.zod';

// ===== body =====

const PutUserDetailsV1Http = z.object({
  email: z.string().email(),
  password: z.string(),
});
export class PutUserDetailsV1HttpDto extends zodDto(PutUserDetailsV1Http) {}

// ===== response =====

const PutUserDetailsV1HttpData = z.object({});
export class PutUserDetailsV1HttpResponse extends zodResponse(
  PutUserDetailsV1HttpData,
) {}
