import { Module } from '@nestjs/common';

import { GenCliModule } from './gen/gen.cli.module';
import { InitialsCliModule } from './initials/initials.cli.module';
import { UsersCliModule } from './users/users.cli.module';

@Module({
  imports: [InitialsCliModule, UsersCliModule, GenCliModule],
})
export class CliModule {}
