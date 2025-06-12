import { Module } from '@nestjs/common';

import { QUEUE } from '@core/shared/worker/worker.queue';
import { createBullmqHandler } from '@core/shared/worker/worker.util';

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
