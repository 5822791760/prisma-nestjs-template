import { BaseCronQueue } from '@core/shared/task/task.abstract';
import { QUEUE } from '@core/shared/task/task.queue';

import { CRONS_JOBS } from './crons.queue.common';

export class CronsQueueService extends BaseCronQueue {
  queueName = QUEUE.CRONS;

  setupCron(): void {
    this.addCron(CRONS_JOBS.SAMPLE, '* * * * *');
  }
}
