import { Injectable } from '@nestjs/common';

import { AuthsService } from '@core/domain/auths/auths.service';
import { UsersService } from '@core/domain/users/users.service';
import { Err, Ok, Res } from '@core/shared/common/common.neverthrow';
import { Read } from '@core/shared/common/common.type';

import { AuthsV1Repo } from './auths.v1.repo';
import {
  PostAuthsSignInsV1Input,
  PostAuthsSignInsV1Output,
} from './schema/post-auths-sign-ins.v1';
import {
  PostAuthsSignUpsV1Input,
  PostAuthsSignUpsV1Output,
} from './schema/post-auths-sign-ups.v1';

@Injectable()
export class AuthsV1Service {
  constructor(
    private repo: AuthsV1Repo,
    private usersService: UsersService,
    private authsService: AuthsService,
  ) {}

  async postAuthsSignIns(
    data: Read<PostAuthsSignInsV1Input>,
  ): Promise<Res<PostAuthsSignInsV1Output, 'notFound' | 'invalidPassword'>> {
    const user = await this.repo.getOneUser(data.email);
    if (!user) {
      return Err('notFound');
    }

    const rAuthenUser = this.usersService.signIn(user, data.password);
    if (rAuthenUser.isErr()) {
      return Err('invalidPassword');
    }

    const authenUser = rAuthenUser.value;

    await this.repo.transaction(async () =>
      this.usersService.dbUpdate(authenUser),
    );

    return Ok({
      token: this.authsService.generateToken(authenUser),
      lastSignedInAt: authenUser.lastSignedInAt,
    });
  }

  async postAuthsSignUps(
    data: Read<PostAuthsSignUpsV1Input>,
  ): Promise<Res<PostAuthsSignUpsV1Output, 'validation' | 'internal'>> {
    const r = await this.usersService.dbValidate({ email: data.email });
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    const newUser = this.usersService.new(data);
    const rNewSignedInUser = this.usersService.signIn(newUser, data.password);
    if (rNewSignedInUser.isErr()) {
      return Err('validation', rNewSignedInUser.error);
    }

    const newSignedInUser = rNewSignedInUser.value;

    const rUser = await this.repo.transaction(async () =>
      this.usersService.dbInsert(newSignedInUser),
    );

    if (rUser.isErr()) {
      return Err('internal', rUser.error);
    }

    const user = rUser.value;

    return Ok({
      token: this.authsService.generateToken(user),
      lastSignedInAt: user.lastSignedInAt,
    });
  }
}
