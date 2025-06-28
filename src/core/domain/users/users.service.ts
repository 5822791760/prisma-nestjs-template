import { Injectable } from '@nestjs/common';

import { hashString, isMatchedHash } from '@core/shared/common/common.crypto';
import myDayjs from '@core/shared/common/common.dayjs';
import { clone } from '@core/shared/common/common.func';
import { Err, Ok, Res } from '@core/shared/common/common.neverthrow';
import { Read } from '@core/shared/common/common.type';

import { UsersRepo } from './users.repo';
import { NewUserData, SignedIn, UpdateUserData, UserData } from './users.type';

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
}
