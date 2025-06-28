import { Injectable } from '@nestjs/common';

import { UsersRepo } from '@core/domain/users/users.repo';
import { UsersService } from '@core/domain/users/users.service';
import { UsersQueueService } from '@core/queue/users/users.queue.service';
import { readCsv } from '@core/shared/common/common.csv';
import {
  Err,
  Ok,
  Res,
  ValidateFields,
  errIs,
  validateSuccess,
} from '@core/shared/common/common.neverthrow';
import { Read } from '@core/shared/common/common.type';
import { getZodErrorFields } from '@core/shared/common/common.zod';

import { GetUsersIdV1Output } from './dto/get-users-id/get-users-id.v1.response';
import { GetUsersV1Input } from './dto/get-users/get-users.v1.dto';
import { GetUsersV1Output } from './dto/get-users/get-users.v1.response';
import { PostUsersImportCsvV1Dto } from './dto/post-users-import-csv/post-users-import-csv..v1.dto';
import { PostUsersImportCsvV1Output } from './dto/post-users-import-csv/post-users-import-csv.v1.response';
import { PostUsersV1Input } from './dto/post-users/post-users.v1.dto';
import { PostUsersV1Output } from './dto/post-users/post-users.v1.response';
import { PutUsersIdV1Input } from './dto/put-users/put-users-id.v1.dto';
import { PutUsersIdV1Output } from './dto/put-users/put-users-id.v1.response';
import { UsersV1Repo } from './users.v1.repo';
import { PostUsersImportCsvV1FileData } from './users.v1.util';

@Injectable()
export class UsersV1Service {
  constructor(
    private repo: UsersV1Repo,
    private usersQueueService: UsersQueueService,
    private usersService: UsersService,
    private usersRepo: UsersRepo,
  ) {}

  async getUsers(
    options: Read<GetUsersV1Input>,
  ): Promise<Res<GetUsersV1Output, ''>> {
    const { data, totalItems } = await this.usersRepo.paginate({
      paginate: options,
      orderBy: { id: 'asc' },
    });

    // Queue job works!
    this.usersQueueService.addJobSample({ key: 'test' });

    return Ok({
      data: data.map((user) => ({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastSignedInAt: user.lastSignedInAt,
      })),
      totalItems,
    });
  }

  async getUsersId(id: number): Promise<Res<GetUsersIdV1Output, 'notFound'>> {
    const user = await this.usersRepo.findFirst({ where: { id } });
    if (!user) {
      return Err('notFound');
    }

    return Ok({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastSignedInAt: user.lastSignedInAt,
    });
  }

  async postUsers(
    body: Read<PostUsersV1Input>,
  ): Promise<Res<PostUsersV1Output, 'validation' | 'internal'>> {
    const newUser = this.usersService.new(body);

    const r = await this.usersRepo.isExists(newUser);
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    const rUser = await this.repo.transaction(async () => {
      return this.usersRepo.create(newUser);
    });

    if (rUser.isErr()) {
      return Err('internal', rUser.error);
    }

    const user = rUser.value;

    return Ok({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastSignedInAt: user.lastSignedInAt,
    });
  }

  async putUsersId(
    body: Read<PutUsersIdV1Input>,
    id: number,
  ): Promise<Res<PutUsersIdV1Output, 'validation' | 'notFound' | 'internal'>> {
    let user = await this.usersRepo.findFirst({
      where: { id },
    });
    if (!user) {
      return Err('notFound');
    }
    user = this.usersService.update(user, body);

    const r = await this.usersRepo.isExists(user);
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    const rUser = await this.repo.transaction(async () => {
      return this.usersRepo.save(user);
    });

    if (rUser.isErr()) {
      return Err('internal', rUser.error);
    }

    const updatedUser = rUser.value;

    return Ok({
      id: updatedUser.id,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      lastSignedInAt: updatedUser.lastSignedInAt,
    });
  }

  async postUsersImportCsv(
    body: Read<PostUsersImportCsvV1Dto>,
  ): Promise<Res<PostUsersImportCsvV1Output[], 'noFile' | 'invalid'>> {
    const data: PostUsersImportCsvV1Output[] = [];
    let fields: ValidateFields<any> = {};

    const r = await readCsv(body.file, {
      skipRows: 1,
      headers: false,
      onRow: ({ row }) => {
        const parsed = PostUsersImportCsvV1FileData.safeParse(row);
        if (!parsed.success) {
          fields = { ...fields, ...getZodErrorFields(parsed.error) };
          return;
        }

        const rowData = parsed.data;
        data.push({
          id: rowData.id,
          email: rowData.email,
          createdAt: rowData.createdAt,
          updatedAt: rowData.updatedAt,
          lastSignedInAt: rowData.lastSignedInAt,
        });
      },
    });

    if (!validateSuccess(fields)) {
      return Err('invalid', { fields });
    }

    if (r.isErr()) {
      const e = r.error;

      if (errIs(e, 'noFile')) {
        return Err('noFile', e);
      }

      return Err('invalid', e);
    }

    return Ok(data);
  }
}
