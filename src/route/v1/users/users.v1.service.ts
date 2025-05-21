import { Injectable } from '@nestjs/common';

import { UsersService } from '@core/domain/users/users.service';
import { UsersQueueService } from '@core/queue/users/users.queue.service';
import { Err, Ok, Res } from '@core/shared/common/common.neverthrow';
import { Read } from '@core/shared/common/common.type';

import { GetUsersIdV1Output } from './schema/get-users-id.v1';
import { GetUsersV1Input, GetUsersV1Output } from './schema/get-users.v1';
import { PostUsersV1Input, PostUsersV1Output } from './schema/post-users.v1';
import {
  PutUsersIdV1Input,
  PutUsersIdV1Output,
} from './schema/put-users-id.v1';
import { UsersV1Repo } from './users.v1.repo';

@Injectable()
export class UsersV1Service {
  constructor(
    private repo: UsersV1Repo,
    private usersQueueService: UsersQueueService,
    private usersService: UsersService,
  ) {}

  async getUsers(
    options: Read<GetUsersV1Input>,
  ): Promise<Res<GetUsersV1Output, ''>> {
    const { data, totalItems } = await this.repo.db.users.paginate(options, {
      orderBy: { id: 'asc' },
    });

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
    const user = await this.repo.db.users.findFirst({ where: { id } });
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
    const newUser = this.usersService.new(body);

    const r = await this.usersService.dbValidate(newUser);
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    await this.repo.transaction(async () => {
      await this.repo.db.users.create({ data: newUser });
    });

    return Ok({});
  }

  async putUsersId(
    body: Read<PutUsersIdV1Input>,
    id: number,
  ): Promise<Res<PutUsersIdV1Output, 'validation' | 'notFound'>> {
    let user = await this.repo.db.users.findFirst({
      where: { id },
    });
    if (!user) {
      return Err('notFound');
    }
    user = this.usersService.update(user, body);

    const r = await this.usersService.dbValidate(user, id);
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    await this.repo.transaction(async () => {
      await this.repo.db.users.update({ data: user, where: { id } });
    });

    return Ok({});
  }
}
