import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/prisma';
import { BaseRepo } from '@core/shared/common/common.repo';
import { Read, Saved } from '@core/shared/common/common.type';

import { UserData } from './users.type';

@Injectable()
export class UsersRepo extends BaseRepo {
  async emailExists(email: string, excludeId?: number) {
    return this.db.users.exists({ email, id: { not: excludeId } });
  }

  async insert<T extends UserData>(data: T): Promise<Saved<T>> {
    const { id } = await this.db.users.create({
      data: data as UserData,
    });

    return {
      id,
      ...data,
    };
  }

  async update<T extends Users>(user: Read<T>) {
    const { id, ...data } = user;

    await this.db.users.update({
      data,
      where: { id },
    });
  }
}
