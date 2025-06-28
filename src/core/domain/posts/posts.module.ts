import { Module } from '@nestjs/common';

import { PostsRepo } from './posts.repo';
import { PostsService } from './posts.service';

@Module({
  providers: [PostsService, PostsRepo],
  exports: [PostsService, PostsRepo],
})
export class PostsModule {}
