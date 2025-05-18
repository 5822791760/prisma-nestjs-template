import { Injectable } from '@nestjs/common';

import { PaginationOptions } from '@core/shared/common/common.pagintaion';
import { BaseRepo } from '@core/shared/common/common.repo';
import { Read } from '@core/shared/common/common.type';

@Injectable()
export class UsersV1Repo extends BaseRepo {
  async getOneUser(id: number) {
    return this.db.users.findFirst({ where: { id } });
  }

  async getAllUsers() {
    return this.db.users.findMany();
  }

  async getPageUsers(options: Read<PaginationOptions>) {
    return this.db.users.paginate(options, {
      orderBy: { id: 'asc' },
    });
  }
}
