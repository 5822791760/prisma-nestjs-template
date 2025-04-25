import { Module } from '@nestjs/common';

import { CronsTaskModule } from './crons/crons.task.module';
import { UsersTaskModule } from './users/users.task.module';

@Module({
  imports: [UsersTaskModule, CronsTaskModule],
})
export class TaskModule {}
