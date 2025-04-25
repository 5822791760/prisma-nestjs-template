import { Module } from '@nestjs/common';

import { PostsCliSeed } from './cmd/posts.cli.seed';
import { PostsCliRepo } from './posts.cli.repo';

@Module({
  providers: [PostsCliSeed, PostsCliRepo],
})
export class PostsCliModule {}
