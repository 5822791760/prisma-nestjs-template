import { z } from 'zod';

import { zodDto } from '@core/shared/common/common.zod';
import { zPagination } from '@core/shared/common/common.zod-extend';

export const GetUsersV1Input = z.object({}).extend(zPagination);
export type GetUsersV1Input = z.infer<typeof GetUsersV1Input>;

export class GetUsersV1Dto extends zodDto(GetUsersV1Input) {}
