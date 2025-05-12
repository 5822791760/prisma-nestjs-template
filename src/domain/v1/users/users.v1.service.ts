import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/prisma';
import { UsersQueueService } from '@core/queue/users/users.queue.service';
import { hashString } from '@core/shared/common/common.crypto';
import tzDayjs from '@core/shared/common/common.dayjs';
import { clone } from '@core/shared/common/common.func';
import {
  Err,
  Ok,
  Res,
  ValidateFields,
  validateSuccess,
} from '@core/shared/common/common.neverthrow';
import { Read } from '@core/shared/common/common.type';

import { GetUsersIdV1Output } from './schema/get-users-id.v1';
import { GetUsersV1Input, GetUsersV1Output } from './schema/get-users.v1';
import { PostUsersV1Input, PostUsersV1Output } from './schema/post-users.v1';
import {
  PutUsersIdV1Input,
  PutUsersIdV1Output,
} from './schema/put-users-id.v1';
import { UsersV1Repo } from './users.v1.repo';
import {
  NewUser,
  NewUserData,
  UpdateUserData,
  ValidateUserData,
} from './users.v1.type';

@Injectable()
export class UsersV1Service {
  constructor(
    private repo: UsersV1Repo,
    private usersQueueService: UsersQueueService,
  ) {}

  async getUsers(
    options: Read<GetUsersV1Input>,
  ): Promise<Res<GetUsersV1Output, ''>> {
    const { data, totalItems } = await this.repo.getPageUsers(options);

    // Queue job works!
    this.usersQueueService.addJobSample({ key: 'test' });

    return Ok({
      data: data.map((user) => ({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      })),
      totalItems,
    });
  }

  async getUsersId(id: number): Promise<Res<GetUsersIdV1Output, 'notFound'>> {
    const user = await this.repo.getOneUser(id);

    if (!user) {
      return Err('notFound');
    }

    return Ok({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  }

  async postUsers(
    body: Read<PostUsersV1Input>,
  ): Promise<Res<PostUsersV1Output, 'validation'>> {
    const r = await this._validateUser(body);
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    const newUser = this._newUser(body);

    await this.repo.transaction(async () => {
      await this.repo.insertUser(newUser);
    });

    return Ok({});
  }

  async putUsersId(
    body: Read<PutUsersIdV1Input>,
    id: number,
  ): Promise<Res<PutUsersIdV1Output, 'validation' | 'notFound'>> {
    const r = await this._validateUser(body, id);
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    let user = await this.repo.getOneUser(id);
    if (!user) {
      return Err('notFound');
    }

    user = this._updateUser(user, body);

    await this.repo.transaction(async () => {
      await this.repo.updateUser(user);
    });

    return Ok({});
  }

  // ========================== Logic helper ==========================

  private _newUser(data: Read<NewUserData>): NewUser {
    return {
      email: data.email,
      password: hashString(data.password),
      createdAt: tzDayjs().toDate(),
      updatedAt: tzDayjs().toDate(),
    };
  }

  private _updateUser(
    userInput: Read<Users>,
    data: Read<UpdateUserData>,
  ): Users {
    const user = clone(userInput);

    if (data.email) {
      user.email = data.email;
    }

    if (data.password) {
      user.password = hashString(data.password);
    }

    user.updatedAt = tzDayjs().toDate();

    return user;
  }

  private async _validateUser(
    data: Read<ValidateUserData>,
    excludeId?: number,
  ): Promise<Res<null, 'validation'>> {
    const fields: ValidateFields<ValidateUserData> = {
      email: [],
    };

    const emailExists = await this.repo.isEmailExistsInUsers(
      data.email,
      excludeId,
    );
    if (emailExists) {
      fields.email.push('exists');
    }

    if (!validateSuccess(fields)) {
      return Err('validation', { fields });
    }

    return Ok(null);
  }
}
