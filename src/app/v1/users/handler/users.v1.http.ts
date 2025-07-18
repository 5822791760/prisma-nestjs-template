import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  getCsvDateDisplay,
  getCsvFileSuffix,
} from '@core/shared/common/common.csv';
import { errIs } from '@core/shared/common/common.neverthrow';
import { getPagination } from '@core/shared/common/common.pagintaion';
import { HeaderCsv, UseFile } from '@core/shared/http/http.decorator';
import { ApiException } from '@core/shared/http/http.exception';
import { CsvParam } from '@core/shared/http/http.param';

import { GetUsersIdV1Response } from '../dto/get-users-id/get-users-id.v1.response';
import { GetUsersV1Dto } from '../dto/get-users/get-users.v1.dto';
import { GetUsersV1Response } from '../dto/get-users/get-users.v1.response';
import { PostUsersImportCsvV1Dto } from '../dto/post-users-import-csv/post-users-import-csv..v1.dto';
import { PostUsersImportCsvV1Response } from '../dto/post-users-import-csv/post-users-import-csv.v1.response';
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
  @HeaderCsv()
  async getUsers(
    @Query() options: GetUsersV1Dto,
    @CsvParam() c: CsvParam,
  ): Promise<GetUsersV1Response> {
    const r = await this.service.getUsers(options);

    return r.match(
      ({ data, totalItems }) => {
        // csv
        if (c.acceptCsv) {
          return c.writeCsv({
            filename: c.t.usersV1Reportfilename({
              suffix: getCsvFileSuffix(),
            }),
            csv: data.map((d) => [
              [c.t.id(), d.id],
              [c.t.email(), d.email],
              [c.t.createdAt(), getCsvDateDisplay(d.createdAt)],
              [c.t.updatedAt(), getCsvDateDisplay(d.updatedAt)],
              [
                c.t.lastSignedInAt(),
                d.lastSignedInAt ? getCsvDateDisplay(d.lastSignedInAt) : '-',
              ],
            ]),
          });
        }

        return {
          success: true,
          key: '',
          data,
          meta: {
            pagination: getPagination(data, totalItems, options),
          },
        };
      },
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

  @Post('import/csv')
  @UseFile('file')
  async postUsersImportCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: PostUsersImportCsvV1Dto,
  ): Promise<PostUsersImportCsvV1Response> {
    body.file = file;

    const r = await this.service.postUsersImportCsv(body);
    return r.match(
      (data) => ({
        success: true,
        key: '',
        data,
      }),
      (e) => {
        if (errIs(e, 'noFile')) {
          throw new ApiException(e, 400);
        }

        if (errIs(e, 'invalid')) {
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
