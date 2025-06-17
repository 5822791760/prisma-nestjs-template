import { ApiProperty } from '@nestjs/swagger';

import { UserResponseData } from '@core/domain/users/users.response';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@core/shared/http/http.response.dto';

export class GetUsersV1Data extends UserResponseData {}

export class GetUsersV1Output {
  data: GetUsersV1Data[];

  @ApiProperty({ example: 20 })
  totalItems: number;
}

export class GetUsersV1Response extends StandardResponse {
  data: GetUsersV1Data[];
  meta: PaginationMetaResponse;
}
