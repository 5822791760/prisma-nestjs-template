import { Injectable } from '@nestjs/common';

import { JobSampleInput } from '@core/queue/users/schema/job-sample';
import { USERS_JOBS } from '@core/queue/users/users.queue.common';
import { BaseTaskHandler } from '@core/shared/worker/worker.abstract';
import { Task } from '@core/shared/worker/worker.decorator';

@Injectable()
export class UsersTaskHandler extends BaseTaskHandler {
  @Task(USERS_JOBS.SAMPLE, JobSampleInput)
  async processSample(data: JobSampleInput) {
    console.log('==================================');
    console.log(`Sample Proccessed: ${data.key}`);
    console.log('==================================');
  }
}
