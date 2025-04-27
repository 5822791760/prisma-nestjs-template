import { BaseQueue } from '@core/shared/worker/worker.abstract';
import { QUEUE } from '@core/shared/worker/worker.queue';

import { ProcessSampleData, USERS_JOBS } from './users.queue.common';

export class UsersQueueService extends BaseQueue {
  queueName = QUEUE.USERS;

  addJobSample(data: ProcessSampleData) {
    this.addJob(USERS_JOBS.SAMPLE, data);
  }
}
