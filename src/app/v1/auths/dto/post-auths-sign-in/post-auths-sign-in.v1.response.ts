import { ApiProperty } from '@nestjs/swagger';

import myDayjs from '@core/shared/common/common.dayjs';
import { StandardResponse } from '@core/shared/http/http.response.dto';

export class PostAuthsSignInV1Output {
  @ApiProperty({ example: 'jwttoken' })
  token: string;

  @ApiProperty({ example: myDayjs().toDate() })
  lastSignedInAt: Date;
}

export class PostAuthsSignInV1Response extends StandardResponse {
  data: PostAuthsSignInV1Output;
}
