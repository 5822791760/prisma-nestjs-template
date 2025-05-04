import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@core/shared/common/common.repo';
import { Read } from '@core/shared/common/common.type';

import { NewUser } from './users.cli.type';

@Injectable()
export class UsersCliRepo extends BaseRepo {
  async createManyUser(data: Read<NewUser>[]) {
    this.db.users.createMany({ data });
  }
}
