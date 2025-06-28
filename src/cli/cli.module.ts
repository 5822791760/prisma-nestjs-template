import { Module } from '@nestjs/common';

import { InitialsCliModule } from './initials/initials.cli.module';
import { UsersCliModule } from './users/users.cli.module';

@Module({
  imports: [InitialsCliModule, UsersCliModule],
})
export class CliModule {}
