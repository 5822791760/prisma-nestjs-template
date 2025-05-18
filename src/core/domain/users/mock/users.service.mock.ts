import myDayjs from '@core/shared/common/common.dayjs';
import { Err, Ok, Res } from '@core/shared/common/common.neverthrow';

import { UsersService } from '../users.service';
import { NewUserData, SignedIn, UpdateUserData, UserData } from '../users.type';

interface Options {
  mockDbValidate: {
    err?: boolean;
  };
  mockSignIn: {
    err?: true;
  };
}

export class UsersServiceMockFactory {
  static new(data?: Partial<NewUserData>): ReturnType<UsersService['new']> {
    return {
      email: data?.email || 'test@example.com',
      password: data?.password || 'password',
      createdAt: myDayjs().toDate(),
      updatedAt: myDayjs().toDate(),
      lastSignedInAt: null,
    };
  }

  static signIn(options?: {
    data?: Partial<UserData>;
    err?: boolean;
  }): Res<SignedIn<UserData>, 'invalidPassword'> {
    if (options?.err) {
      return Err('invalidPassword');
    }

    return Ok({
      email: options?.data?.email || 'test@example.com',
      password: options?.data?.password || 'password',
      createdAt: myDayjs().toDate(),
      updatedAt: myDayjs().toDate(),
      lastSignedInAt: myDayjs().toDate(),
    });
  }

  static update(data?: UpdateUserData): ReturnType<UsersService['update']> {
    return {
      email: data?.email || 'test@example.com',
      password: data?.password || 'password',
      createdAt: data?.createdAt || myDayjs().toDate(),
      updatedAt: myDayjs().toDate(),
      lastSignedInAt: data?.lastSignedInAt || myDayjs().toDate(),
    };
  }

  static dbInsert(id: number): Awaited<ReturnType<UsersService['dbInsert']>> {
    return {
      id,
      email: 'test@example.com',
      password: 'password',
      createdAt: myDayjs().toDate(),
      updatedAt: myDayjs().toDate(),
      lastSignedInAt: null,
    };
  }

  static dbUpdate(): Awaited<ReturnType<UsersService['dbUpdate']>> {
    return;
  }

  static dbValidate(
    options?: Options['mockDbValidate'],
  ): Awaited<ReturnType<UsersService['dbValidate']>> {
    if (options?.err) {
      return Err('validation', {});
    }

    return Ok(null);
  }
}
