import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/prisma';
import { BaseRepo } from '@core/shared/common/common.repo';
import { Read } from '@core/shared/common/common.type';

import { AuthenticatedUser, NewUser } from './auths.v1.type';

@Injectable()
export class AuthsV1Repo extends BaseRepo {
  async getOneUser(email: string): Promise<Users | null> {
    return this.db.users.findFirst({ where: { email } });
  }

  async insertAuthUser(data: Read<NewUser>): Promise<AuthenticatedUser> {
    const user = await this.db.users.create({ data });
    return user as AuthenticatedUser;
  }

  async updateUser(user: Read<Users>) {
    const { id, ...data } = user;

    await this.db.users.update({ where: { id }, data });
  }

  async isEmailExistsInUsers(email: string): Promise<boolean> {
    const user = await this.db.users.findFirst({
      where: { email },
      select: { id: true },
    });
    return !!user?.id;
  }
}
