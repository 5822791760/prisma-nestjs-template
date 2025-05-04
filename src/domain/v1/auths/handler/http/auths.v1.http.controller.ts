import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsePublic } from '@core/middleware/jwt/jwt.common';
import { errIs } from '@core/shared/common/common.neverthrow';
import { ApiException } from '@core/shared/http/http.exception';

import { AuthsV1Service } from '../../auths.v1.service';
import {
  PostAuthsSignInsV1HttpDto,
  PostAuthsSignInsV1HttpResponse,
  PostAuthsSignUpsHttpResponse,
  PostAuthsSignUpsV1HttpDto,
} from './auths.v1.http.dto';

@ApiTags('v1')
@Controller({
  path: 'auths',
  version: '1',
})
export class AuthsV1HttpController {
  constructor(private service: AuthsV1Service) {}

  @Post('sign-ups')
  @UsePublic()
  async postAuthsSignUps(
    @Body() body: PostAuthsSignUpsV1HttpDto,
  ): Promise<PostAuthsSignUpsHttpResponse> {
    const r = await this.service.postAuthsSignUps(body);

    return r.match(
      (data) => ({
        success: true,
        key: '',
        data,
      }),
      (e) => {
        if (errIs(e, 'validation')) {
          throw new ApiException(e, 400);
        }

        if (errIs(e, 'internal')) {
          throw new ApiException(e, 500);
        }

        throw new ApiException(e, 500);
      },
    );
  }

  @Post('sign-ins')
  @UsePublic()
  async postAuthsSignIns(
    @Body() body: PostAuthsSignInsV1HttpDto,
  ): Promise<PostAuthsSignInsV1HttpResponse> {
    const r = await this.service.postAuthsSignIns(body);

    return r.match(
      (data) => ({
        success: true,
        key: '',
        data,
      }),
      (e) => {
        if (errIs(e, 'invalidPassword')) {
          throw new ApiException(e, 400);
        }

        if (errIs(e, 'notFound')) {
          throw new ApiException(e, 400);
        }

        throw new ApiException(e, 500);
      },
    );
  }
}
