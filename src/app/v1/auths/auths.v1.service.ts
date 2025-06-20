import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/prisma';
import { AuthsService } from '@core/domain/auths/auths.service';
import { UsersService } from '@core/domain/users/users.service';
import { SignedIn } from '@core/domain/users/users.type';
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
    private authsService: AuthsService,
  ) {}

  async postAuthsSignIn(
    data: Read<PostAuthsSignInV1Input>,
  ): Promise<Res<PostAuthsSignInV1Output, 'notFound' | 'invalidPassword'>> {
    const user = await this.repo.db.users.findFirst({
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

    await this.repo.transaction(async () =>
      this.repo.db.users.update({
        where: { id: authenUser.id },
        data: authenUser,
      }),
    );

    return Ok({
      token: this.authsService.generateToken(authenUser),
      lastSignedInAt: authenUser.lastSignedInAt,
    });
  }

  async postAuthsSignUp(
    data: Read<PostAuthsSignUpV1Input>,
  ): Promise<Res<PostAuthsSignUpV1Output, 'validation' | 'internal'>> {
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

    const rUser = await this.repo.transaction(async () => {
      const user = await this.repo.db.users.create({ data: newSignedInUser });
      return user;
    });

    if (rUser.isErr()) {
      return Err('internal', rUser.error);
    }

    const user = rUser.value as SignedIn<Users>;

    return Ok({
      token: this.authsService.generateToken(user),
      lastSignedInAt: user.lastSignedInAt,
    });
  }
}
