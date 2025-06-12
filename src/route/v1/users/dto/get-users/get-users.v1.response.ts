import { ApiProperty } from '@nestjs/swagger';

import myDayjs from '@core/shared/common/common.dayjs';
import {
  PaginationMetaResponse,
  StandardResponse,
} from '@core/shared/http/http.response.dto';

export class GetUsersV1Data {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: myDayjs().toDate() })
  createdAt: Date;
}

export class GetUsersV1Output {
  data: GetUsersV1Data[];

  @ApiProperty({ example: 20 })
  totalItems: number;
}

export class GetUsersV1Response extends StandardResponse {
  data: GetUsersV1Data[];
  meta: PaginationMetaResponse;
}
