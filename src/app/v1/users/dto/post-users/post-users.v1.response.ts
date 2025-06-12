import { ApiProperty } from '@nestjs/swagger';

import myDayjs from '@core/shared/common/common.dayjs';
import { StandardResponse } from '@core/shared/http/http.response.dto';

export class PostUsersV1Output {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: myDayjs().toDate() })
  createdAt: Date;
}

export class PostUsersV1Response extends StandardResponse {
  data: PostUsersV1Output;
}
