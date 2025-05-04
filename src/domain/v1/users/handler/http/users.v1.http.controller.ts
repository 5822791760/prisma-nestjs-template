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

import { UsersV1Service } from '../../users.v1.service';
import {
  GetUsersDetailsV1HttpResponse,
  GetUsersV1HttpDto,
  GetUsersV1HttpResponse,
  PostUsersV1HttpDto,
  PostUsersV1HttpResponse,
  PutUserDetailsV1HttpDto,
  PutUserDetailsV1HttpResponse,
} from './users.v1.http.dto';

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
    @Query() options: GetUsersV1HttpDto,
  ): Promise<GetUsersV1HttpResponse> {
    const r = await this.service.getUsers(options);

    return r.match(
      ({ data, totalItems }) => ({
        success: true,
        key: '',
        data,
        meta: getPagination(data, totalItems, options),
      }),
      (e) => {
        throw new ApiException(e, 500);
      },
    );
  }

  @Post()
  async postUsers(
    @Body() body: PostUsersV1HttpDto,
  ): Promise<PostUsersV1HttpResponse> {
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
  async getUserDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetUsersDetailsV1HttpResponse> {
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
