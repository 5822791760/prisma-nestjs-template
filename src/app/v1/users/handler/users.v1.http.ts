import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { errIs } from '@core/shared/common/common.neverthrow';
import { getPagination } from '@core/shared/common/common.pagintaion';
import { ApiException } from '@core/shared/http/http.exception';

import { GetUsersIdV1Response } from '../dto/get-users-id/get-users-id.v1.response';
import { GetUsersV1Dto } from '../dto/get-users/get-users.v1.dto';
import { GetUsersV1Response } from '../dto/get-users/get-users.v1.response';
import { PostUsersV1Dto } from '../dto/post-users/post-users.v1.dto';
import { PostUsersV1Response } from '../dto/post-users/post-users.v1.response';
import { PutUsersIdV1Dto } from '../dto/put-users/put-users-id.v1.dto';
import { PutUsersIdV1Response } from '../dto/put-users/put-users-id.v1.response';
import { UsersV1Service } from '../users.v1.service';

@ApiTags('v1')
@ApiBearerAuth()
@Controller({
  path: 'users',
  version: '1',
})
export class UsersV1Http {
  constructor(private service: UsersV1Service) {}

  @Get()
  async getUsers(@Query() options: GetUsersV1Dto): Promise<GetUsersV1Response> {
    const r = await this.service.getUsers(options);

    return r.match(
      ({ data, totalItems }) => ({
        success: true,
        key: '',
        data,
        meta: {
          pagination: getPagination(data, totalItems, options),
        },
      }),
      (e) => {
        throw new ApiException(e, 500);
      },
    );
  }

  @Post()
  async postUsers(@Body() body: PostUsersV1Dto): Promise<PostUsersV1Response> {
    const r = await this.service.postUsers(body);

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

        throw new ApiException(e, 500);
      },
    );
  }

  @Get(':id')
  async getUsersId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetUsersIdV1Response> {
    const r = await this.service.getUsersId(id);

    return r.match(
      (data) => ({
        success: true,
        key: '',
        data,
      }),
      (e) => {
        if (errIs(e, 'notFound')) {
          throw new ApiException(e, 400);
        }

        throw new ApiException(e, 500);
      },
    );
  }

  @Put(':id')
  async putUsersId(
    @Body() body: PutUsersIdV1Dto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PutUsersIdV1Response> {
    const r = await this.service.putUsersId(body, id);

    return r.match(
      (data) => ({
        success: true,
        key: '',
        data,
      }),
      (e) => {
        if (errIs(e, 'notFound')) {
          throw new ApiException(e, 400);
        }

        if (errIs(e, 'validation')) {
          throw new ApiException(e, 400);
        }

        throw new ApiException(e, 500);
      },
    );
  }
}
