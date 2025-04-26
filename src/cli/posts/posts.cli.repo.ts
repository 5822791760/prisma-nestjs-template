import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@core/shared/common/common.repo';

import { NewPost } from './posts.cli.type';

@Injectable()
export class PostsCliRepo extends BaseRepo {
  async getUsers() {
    return this.db.users.findMany();
  }

  async createPosts(data: NewPost[]) {
    await this.db.posts.createMany({ data });
  }
}
