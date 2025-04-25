import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/entities/Users';
import { BaseRepo } from '@core/shared/common/common.repo';

import { AuthenticatedUser, NewUser } from './auths.v1.type';

@Injectable()
export class AuthsV1Repo extends BaseRepo {
  async getOneUser(email: string): Promise<Users | null> {
    return this.from(Users).findOne({ where: { email } });
  }

  async insertAuthUser(data: NewUser): Promise<AuthenticatedUser | null> {
    let newUser = this.from(Users).create(data);
    newUser = await this.from(Users).save(newUser);

    return newUser as AuthenticatedUser;
  }

  async updateUser(user: Users) {
    const { id, ...data } = user;

    await this.from(Users).update(id, data);
  }

  async isEmailExistsInUsers(email: string): Promise<boolean> {
    return this.from(Users).existsBy({ email });
  }
}
