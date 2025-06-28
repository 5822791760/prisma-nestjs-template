import { Module } from '@nestjs/common';

import { UsersRepo } from './users.repo';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, UsersRepo],
  exports: [UsersService, UsersRepo],
})
export class UsersModule {}
