import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/prisma';
import {
  Err,
  Ok,
  Res,
  ValidateFields,
} from '@core/shared/common/common.neverthrow';
import { BaseRepo } from '@core/shared/common/common.repo';
import { Read } from '@core/shared/common/common.type';

import { UsersFindFirstOptions, UsersPaginateOptions } from './users.repo.type';
import { UserData } from './users.type';

@Injectable()
export class UsersRepo extends BaseRepo {
  async paginate(opts: Read<UsersPaginateOptions>) {
    const { data, totalItems } = await this.db.users.paginate(opts.paginate, {
      orderBy: opts.orderBy,
    });

    return { data, totalItems };
  }

  async findFirst(opts: Read<UsersFindFirstOptions>) {
    return this.db.users.findFirst({ where: opts.where });
  }

  async create(user: UserData): Promise<Users> {
    // incase id is sent
    delete user['id'];

    const createdUser = await this.db.users.create({
      data: user,
    });

    return createdUser;
  }

  async createMany(user: UserData[]) {
    await this.db.users.createMany({
      data: user,
    });
  }

  async update<T extends Users>(user: T) {
    const { id, ...data } = user;

    await this.db.users.update({
      where: { id },
      data,
    });

    return user;
  }

  async isExists(
    user: Read<Users | UserData>,
  ): Promise<Res<null, 'validation'>> {
    let invalid = false;
    const fields: ValidateFields<{ email: string }> = {
      email: [],
    };

    const emailExists = await this.db.users.exists({
      email: user.email,
      id: { not: (user as Users).id },
    });

    if (emailExists) {
      fields.email.push('exists');
      invalid = true;
    }

    if (invalid) {
      return Err('validation', { fields });
    }

    return Ok(null);
  }
}
