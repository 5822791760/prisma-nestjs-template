import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/prisma';
import { UsersRepo } from '@core/domain/users/users.repo';
import { UsersService } from '@core/domain/users/users.service';
import { SignedIn } from '@core/domain/users/users.type';
import { encodeUserJwt } from '@core/shared/common/common.crypto';
import { Err, Ok, Res } from '@core/shared/common/common.neverthrow';
import { Read } from '@core/shared/common/common.type';

import { AuthsV1Repo } from './auths.v1.repo';
import { PostAuthsSignInV1Input } from './dto/post-auths-sign-in/post-auths-sign-in.v1.dto';
import { PostAuthsSignInV1Output } from './dto/post-auths-sign-in/post-auths-sign-in.v1.response';
import { PostAuthsSignUpV1Input } from './dto/post-auths-sign-up/post-auths-sign-up.v1.dto';
import { PostAuthsSignUpV1Output } from './dto/post-auths-sign-up/post-auths-sign-up.v1.response';

@Injectable()
export class AuthsV1Service {
  constructor(
    private repo: AuthsV1Repo,
    private usersService: UsersService,
    private usersRepo: UsersRepo,
  ) {}

  async postAuthsSignIn(
    data: Read<PostAuthsSignInV1Input>,
  ): Promise<Res<PostAuthsSignInV1Output, 'notFound' | 'invalidPassword'>> {
    const user = await this.usersRepo.findFirst({
      where: { email: data.email },
    });
    if (!user) {
      return Err('notFound');
    }

    const rAuthenUser = this.usersService.signIn(user, data.password);
    if (rAuthenUser.isErr()) {
      return Err('invalidPassword');
    }

    const authenUser = rAuthenUser.value;

    await this.repo.transaction(async () => this.usersRepo.update(authenUser));

    return Ok({
      token: encodeUserJwt(user),
      lastSignedInAt: authenUser.lastSignedInAt,
    });
  }

  async postAuthsSignUp(
    data: Read<PostAuthsSignUpV1Input>,
  ): Promise<Res<PostAuthsSignUpV1Output, 'validation' | 'internal'>> {
    const newUser = this.usersService.new(data);
    const r = await this.usersRepo.isExists(newUser);
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    const rNewSignedInUser = this.usersService.signIn(newUser, data.password);
    if (rNewSignedInUser.isErr()) {
      return Err('validation', rNewSignedInUser.error);
    }

    const newSignedInUser = rNewSignedInUser.value;

    const rUser = await this.repo.transaction(async () => {
      const user = await this.usersRepo.create(newSignedInUser);
      return user;
    });

    if (rUser.isErr()) {
      return Err('internal', rUser.error);
    }

    const user = rUser.value as SignedIn<Users>;

    return Ok({
      token: encodeUserJwt(user),
      lastSignedInAt: user.lastSignedInAt,
    });
  }
}
