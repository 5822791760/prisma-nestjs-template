import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { PaginationOptions } from '@core/shared/common/common.pagintaion';
import { PaginationMetaResponse } from '@core/shared/http/http.response.dto';
import {
  IPaginationMeta,
  IStandardArrayApiResponse,
} from '@core/shared/http/http.standard';

import { UserDetails } from '../../../users.v1.type';

// === request ===

export class GetUsersV1HttpParam implements PaginationOptions {
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @IsNotEmpty()
  @Type(() => Number)
  perPage: number;
}

// === response ===

class GetUsersV1HttpData implements UserDetails {
  id: number;
  email: string;
  createdAt: Date;
}

export class GetUsersV1HttpResponse
  implements IStandardArrayApiResponse<IPaginationMeta>
{
  success: boolean;
  key: string;
  data: GetUsersV1HttpData[];
  meta: PaginationMetaResponse;
}
