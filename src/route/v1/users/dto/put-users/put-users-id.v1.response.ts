import { ApiProperty } from '@nestjs/swagger';

import myDayjs from '@core/shared/common/common.dayjs';
import { StandardResponse } from '@core/shared/http/http.response.dto';

export class PutUsersIdV1Output {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: myDayjs().toDate() })
  createdAt: Date;
}

export class PutUsersIdV1Response extends StandardResponse {
  data: PutUsersIdV1Output;
}
