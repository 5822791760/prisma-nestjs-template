import { Module } from '@nestjs/common';

import { QUEUE } from '@core/shared/worker/worker.queue';
import { createTaskHandler } from '@core/shared/worker/worker.util';

import { CronsTaskRepo } from './crons.task.repo';
import { CronsTaskHandler } from './handler/crons.task.handler';

@Module({
  providers: [
    CronsTaskRepo,

    // Handler
    createTaskHandler(QUEUE.crons, CronsTaskHandler),
  ],
})
export class CronsTaskModule {}
