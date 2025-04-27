import { BaseCronQueue } from '@core/shared/worker/worker.abstract';
import { QUEUE } from '@core/shared/worker/worker.queue';

import { CRONS_JOBS } from './crons.queue.common';

export class CronsQueueService extends BaseCronQueue {
  queueName = QUEUE.CRONS;

  setupCron(): void {
    this.addCron(CRONS_JOBS.SAMPLE, '* * * * *');
  }
}
