import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/prisma';
import { PaginationOptions } from '@core/shared/common/common.pagintaion';
import { BaseRepo } from '@core/shared/common/common.repo';
import { Read } from '@core/shared/common/common.type';

import { NewUser } from './users.v1.type';

@Injectable()
export class UsersV1Repo extends BaseRepo {
  async getOneUser(id: number) {
    return this.db.users.findFirst({ where: { id } });
  }

  async getAllUsers() {
    return this.db.users.findMany();
  }

  async getPageUsers(options: Read<PaginationOptions>): Promise<GetPageUsers> {
    return this.db.users.paginate(options, {
      orderBy: { id: 'asc' },
    });
  }

  async insertUser(data: Read<NewUser>): Promise<void> {
    await this.db.users.create({ data });
  }

  async updateUser(user: Read<Users>): Promise<void> {
    const { id, ...data } = user;

    await this.db.users.update({
      where: { id },
      data,
    });
  }

  async isEmailExistsInUsers(
    email: string,
    excludeId?: number,
  ): Promise<boolean> {
    return this.db.users.exists({ email, id: { not: excludeId } });
  }
}

// ========= Type =========

interface GetPageUsers {
  data: Users[];
  totalItems: number;
}
