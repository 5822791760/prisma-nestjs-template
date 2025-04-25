import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@core/shared/common/common.repo';

import { PostData, UserData } from './initials.cli.type';

@Injectable()
export class InitialsCliRepo extends BaseRepo {
  async createUsers(data: UserData) {
    return this.db.users.create({ data });
  }

  async createManyPosts(data: PostData[]) {
    return this.db.posts.createMany({ data });
  }
}
