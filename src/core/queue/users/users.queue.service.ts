import { BaseQueue } from '@core/shared/task/task.abstract';
import { QUEUE } from '@core/shared/task/task.queue';

import { JobSampleInput } from './schema/job-sample';
import { USERS_JOBS } from './users.queue.common';

export class UsersQueueService extends BaseQueue {
  queueName = QUEUE.USERS;

  addJobSample(data: JobSampleInput) {
    this.addJob(USERS_JOBS.SAMPLE, data);
  }
}
