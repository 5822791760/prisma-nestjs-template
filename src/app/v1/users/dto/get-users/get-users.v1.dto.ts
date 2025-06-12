import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';

export const GetUsersV1Input = z.object({
  page: z.coerce.number(),
  perPage: z.coerce.number(),
});
export type GetUsersV1Input = z.infer<typeof GetUsersV1Input>;

export class GetUsersV1Dto extends zodDto(GetUsersV1Input) {}
