import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/prisma';
import { BaseRepo } from '@core/shared/common/common.repo';

@Injectable()
export class AuthsV1Repo extends BaseRepo {
  async getOneUser(email: string): Promise<Users | null> {
    return this.db.users.findFirst({ where: { email } });
  }
}
