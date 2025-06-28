import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@core/shared/common/common.repo';

import { PostData } from './posts.type';

@Injectable()
export class PostsRepo extends BaseRepo {
  async createMany(posts: PostData[]) {
    await this.db.posts.createMany({
      data: posts,
    });
  }
}
