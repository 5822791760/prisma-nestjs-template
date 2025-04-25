import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/prisma';
import {
  PaginationOptions,
  getLimit,
  getOffset,
} from '@core/shared/common/common.pagintaion';
import { BaseRepo } from '@core/shared/common/common.repo';

import { NewUser } from './users.v1.type';

@Injectable()
export class UsersV1Repo extends BaseRepo {
  async getOneUser(id: number) {
    return this.db.users.findFirst({ where: { id } });
  }

  async getAllUsers() {
    return this.db.users.findMany();
  }

  async getPageUsers(options: PaginationOptions): Promise<GetPageUsers> {
    const totalItems = await this.db.users.count();

    const datas = await this.db.users.findMany({
      take: getLimit(options),
      skip: getOffset(options),
      orderBy: { id: 'asc' },
    });

    return { datas, totalItems };
  }

  async insertUser(data: NewUser): Promise<void> {
    await this.db.users.create({ data });
  }

  async updateUser(user: Users): Promise<void> {
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
    const data = await this.db.users.findFirst({
      select: { id: true },
      where: { email, id: { not: excludeId } },
    });

    return !!data?.id;
  }
}

// ========= Type =========

interface GetPageUsers {
  datas: Users[];
  totalItems: number;
}
