import { Module } from '@nestjs/common';

import { QUEUE } from '@core/shared/worker/worker.queue';
import { createBullmqHandler } from '@core/shared/worker/worker.util';

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
