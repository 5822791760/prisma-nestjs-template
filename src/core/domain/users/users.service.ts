import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/prisma';
import { hashString, isMatchedHash } from '@core/shared/common/common.crypto';
import myDayjs from '@core/shared/common/common.dayjs';
import { clone } from '@core/shared/common/common.func';
import {
  Err,
  Ok,
  Res,
  ValidateFields,
  validateSuccess,
} from '@core/shared/common/common.neverthrow';
import { Read } from '@core/shared/common/common.type';

import { UsersRepo } from './users.repo';
import {
  NewUserData,
  SignedIn,
  UpdateUserData,
  UserData,
  ValidateUserData,
} from './users.type';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepo) {}

  new(data: Read<NewUserData>): UserData {
    return {
      email: data.email,
      password: hashString(data.password),
      createdAt: myDayjs().toDate(),
      updatedAt: myDayjs().toDate(),
      lastSignedInAt: null,
    };
  }

  signIn<T extends UserData>(
    data: Read<T>,
    rawPassword: string,
  ): Res<SignedIn<T>, 'invalidPassword'> {
    if (!isMatchedHash(rawPassword, data.password)) {
      return Err('invalidPassword');
    }

    const user = this.update(data, {
      lastSignedInAt: myDayjs().toDate(),
    });

    return Ok(user as SignedIn<T>);
  }

  update<T extends UserData>(
    userInput: Read<T>,
    data: Read<UpdateUserData>,
  ): T {
    const user = clone(userInput);

    if (data.email) {
      user.email = data.email;
    }

    if (data.password) {
      user.password = hashString(data.password);
    }

    if (data.lastSignedInAt) {
      user.lastSignedInAt = data.lastSignedInAt;
    }

    user.updatedAt = myDayjs().toDate();

    return user;
  }

  // Query helper

  async dbInsert<T extends UserData>(data: T) {
    return this.repo.insert(data);
  }

  async dbUpdate<T extends Users>(user: Read<T>) {
    await this.repo.update(user);
  }

  async dbValidate(
    data: Read<ValidateUserData>,
    excludeId?: number,
  ): Promise<Res<null, 'validation'>> {
    const fields: ValidateFields<ValidateUserData> = {
      email: [],
    };

    const emailExists = await this.repo.emailExists(data.email, excludeId);
    if (emailExists) {
      fields.email.push('exists');
    }

    if (!validateSuccess(fields)) {
      return Err('validation', { fields });
    }

    return Ok(null);
  }
}
