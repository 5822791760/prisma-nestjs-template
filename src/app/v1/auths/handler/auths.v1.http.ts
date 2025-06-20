import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsePublic } from '@core/middleware/jwt/jwt.common';
import { errIs } from '@core/shared/common/common.neverthrow';
import { ApiException } from '@core/shared/http/http.exception';

import { AuthsV1Service } from '../auths.v1.service';
import { PostAuthsSignInV1Dto } from '../dto/post-auths-sign-in/post-auths-sign-in.v1.dto';
import { PostAuthsSignInV1Response } from '../dto/post-auths-sign-in/post-auths-sign-in.v1.response';
import { PostAuthsSignUpV1Dto } from '../dto/post-auths-sign-up/post-auths-sign-up.v1.dto';
import { PostAuthsSignUpV1Response } from '../dto/post-auths-sign-up/post-auths-sign-up.v1.response';

@ApiTags('v1')
@Controller({
  path: 'auths',
  version: '1',
})
export class AuthsV1Http {
  constructor(private service: AuthsV1Service) {}

  @Post('sign-up')
  @UsePublic()
  async postAuthsSignUp(
    @Body() body: PostAuthsSignUpV1Dto,
  ): Promise<PostAuthsSignUpV1Response> {
    const r = await this.service.postAuthsSignUp(body);

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

  @Post('sign-in')
  @UsePublic()
  async postAuthsSignIn(
    @Body() body: PostAuthsSignInV1Dto,
  ): Promise<PostAuthsSignInV1Response> {
    const r = await this.service.postAuthsSignIn(body);

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
