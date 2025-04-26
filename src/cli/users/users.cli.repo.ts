import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@core/shared/common/common.repo';

import { NewUser } from './users.cli.type';

@Injectable()
export class UsersCliRepo extends BaseRepo {
  async createManyUser(data: NewUser[]) {
    this.db.users.createMany({ data });
  }
}
