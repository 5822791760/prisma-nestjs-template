import { Module } from '@nestjs/common';

import QUEUE from '@core/shared/worker/worker.queue';
import { createTaskHandler } from '@core/shared/worker/worker.util';

import { UsersTaskHandler } from './handler/users.task.handler';
import { UsersTaskRepo } from './users.task.repo';

@Module({
  providers: [
    UsersTaskRepo,

    // Handler
    createTaskHandler(QUEUE.users, UsersTaskHandler),
  ],
})
export class UsersTaskModule {}
