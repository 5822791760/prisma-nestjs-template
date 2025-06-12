import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';

export const PutUsersIdV1Input = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type PutUsersIdV1Input = z.infer<typeof PutUsersIdV1Input>;

export class PutUsersIdV1Dto extends zodDto(PutUsersIdV1Input) {}
