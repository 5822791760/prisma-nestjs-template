import { Module } from '@nestjs/common';

import { UsersCliSeed } from './cmd/users.cli.seed';
import { UsersCliRepo } from './users.cli.repo';

@Module({
  providers: [UsersCliSeed, UsersCliRepo],
})
export class UsersCliModule {}
