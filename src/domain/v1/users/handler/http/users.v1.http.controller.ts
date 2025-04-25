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
import { ApiException } from '@core/shared/http/http.exception';

import { UsersV1Service } from '../../users.v1.service';
import { GetUserDetailsV1HttpResponse } from './dto/get-user-details.v1.http.dto';
import {
  GetUsersV1HttpParam,
  GetUsersV1HttpResponse,
} from './dto/get-users.v1.http.dto';
import {
  PostUsersV1HttpDto,
  PostUsersV1HttpResponse,
} from './dto/post-users.v1.http.dto';
import {
  PutUserDetailsV1HttpDto,
  PutUserDetailsV1HttpResponse,
} from './dto/put-user-details.v1.http.dto';

@ApiTags('v1')
@ApiBearerAuth()
@Controller({
  path: 'users',
  version: '1',
})
export class UsersV1HttpController {
  constructor(private service: UsersV1Service) {}

  @Get()
  async getUsers(
    @Query() options: GetUsersV1HttpParam,
  ): Promise<GetUsersV1HttpResponse> {
    const { datas, pagination } = await this.service.getUsers(options);

    return {
      success: true,
      key: '',
      data: datas,
      meta: {
        pagination,
      },
    };
  }

  @Post()
  async postUsers(
    @Body() body: PostUsersV1HttpDto,
  ): Promise<PostUsersV1HttpResponse> {
    const r = await this.service.postUsers(body);

    return r.match(
      () => ({
        success: true,
        key: '',
        data: {},
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
  async getUserDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetUserDetailsV1HttpResponse> {
    const r = await this.service.getUserDetails(id);

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
  async putUserDetails(
    @Body() body: PutUserDetailsV1HttpDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PutUserDetailsV1HttpResponse> {
    const r = await this.service.putUserDetails(body, id);

    return r.match(
      () => ({
        success: true,
        key: '',
        data: {},
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
