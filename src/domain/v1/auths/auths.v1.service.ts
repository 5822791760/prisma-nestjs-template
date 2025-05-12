import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '@core/config';
import { Users } from '@core/db/prisma';
import {
  encodeUserJwt,
  hashString,
  isMatchedHash,
} from '@core/shared/common/common.crypto';
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

import { AuthsV1Repo } from './auths.v1.repo';
import {
  AuthenticatedUser,
  NewUser,
  NewUserData,
  UserData,
  ValidateSignUpData,
} from './auths.v1.type';
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
    private configService: ConfigService,
  ) {}

  async postAuthsSignIns(
    data: Read<PostAuthsSignInsV1Input>,
  ): Promise<Res<PostAuthsSignInsV1Output, 'notFound' | 'invalidPassword'>> {
    const user = await this.repo.getOneUser(data.email);
    if (!user) {
      return Err('notFound');
    }

    const rAuthenUser = this._authenticateUser(user, data.password);
    if (rAuthenUser.isErr()) {
      return Err('invalidPassword');
    }

    const authenUser = rAuthenUser.value;

    await this.repo.transaction(async () => this.repo.updateUser(authenUser));

    return Ok({
      token: this._generateToken(authenUser),
      lastSignedInAt: authenUser.lastSignedInAt,
    });
  }

  async postAuthsSignUps(
    data: Read<PostAuthsSignUpsV1Input>,
  ): Promise<Res<PostAuthsSignUpsV1Output, 'validation' | 'internal'>> {
    const r = await this._validateSignUp(data);
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    const newUser = this._registerUser(data);
    const rUser = await this.repo.transaction(async () =>
      this.repo.insertAuthUser(newUser),
    );

    if (rUser.isErr()) {
      return Err('internal', rUser.error);
    }

    const user = rUser.value;
    if (!user) {
      return Err('internal');
    }

    return Ok({
      token: this._generateToken(user),
      lastSignedInAt: user.lastSignedInAt,
    });
  }

  // Logic Helper ========

  private _registerUser(data: Read<NewUserData>): NewUser {
    return {
      email: data.email,
      password: hashString(data.password),
      createdAt: tzDayjs().toDate(),
      updatedAt: tzDayjs().toDate(),
      lastSignedInAt: tzDayjs().toDate(),
    };
  }

  private _authenticateUser(
    user: Read<Users>,
    rawPassword: string,
  ): Res<AuthenticatedUser, 'invalidPassword'> {
    if (!isMatchedHash(rawPassword, user.password)) {
      return Err('invalidPassword');
    }

    user = this._updateUser(user, {
      lastSignedInAt: tzDayjs().toDate(),
    });

    return Ok(user as AuthenticatedUser);
  }

  private _generateToken(user: Read<AuthenticatedUser>): string {
    const jwtConfig = this.configService.getOrThrow<AppConfig['jwt']>('jwt');
    return encodeUserJwt({ id: user.id }, jwtConfig.salt);
  }

  private _updateUser(userInput: Read<Users>, data: Read<UserData>): Users {
    const user = clone(userInput);

    if (data.lastSignedInAt) {
      user.lastSignedInAt = data.lastSignedInAt;
    }

    user.updatedAt = tzDayjs().toDate();

    return user;
  }

  private async _validateSignUp(
    data: Read<ValidateSignUpData>,
  ): Promise<Res<null, 'validation'>> {
    const fields: ValidateFields<ValidateSignUpData> = {
      email: [],
    };

    const emailExists = await this.repo.isEmailExistsInUsers(data.email);
    if (emailExists) {
      fields.email.push('exists');
    }

    if (!validateSuccess(fields)) {
      return Err('validation', { fields });
    }

    return Ok(null);
  }
}
