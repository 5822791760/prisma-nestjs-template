import { ApiProperty } from '@nestjs/swagger';

import myDayjs from '@core/shared/common/common.dayjs';
import { StandardResponse } from '@core/shared/http/http.response.dto';

export class PostAuthsSignUpV1Output {
  @ApiProperty({ example: 'jwt token' })
  token: string;

  @ApiProperty({ example: myDayjs().toDate() })
  lastSignedInAt: Date;
}

export class PostAuthsSignUpV1Response extends StandardResponse {
  data: PostAuthsSignUpV1Output;
}
