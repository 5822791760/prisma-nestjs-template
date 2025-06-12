import { Module } from '@nestjs/common';

import { createBullmqHandler } from '@core/shared/common/common.worker';
import { QUEUE } from '@core/shared/task/task.queue';

import { UsersTaskBullmq } from './handler/users.task.bullmq';
import { UsersTaskRepo } from './users.task.repo';

@Module({
  providers: [
    UsersTaskRepo,

    // Handler
    createBullmqHandler(QUEUE.USERS, UsersTaskBullmq),
  ],
})
export class UsersTaskModule {}
