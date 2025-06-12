import { Module } from '@nestjs/common';

import { createBullmqHandler } from '@core/shared/common/common.worker';
import { QUEUE } from '@core/shared/task/task.queue';

import { CronsTaskRepo } from './crons.task.repo';
import { CronsTaskBullmq } from './handler/crons.task.bullmq';

@Module({
  providers: [
    CronsTaskRepo,

    // Handler
    createBullmqHandler(QUEUE.CRONS, CronsTaskBullmq),
  ],
})
export class CronsTaskModule {}
