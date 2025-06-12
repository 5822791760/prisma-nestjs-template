import { Injectable } from '@nestjs/common';

import { CRONS_JOBS } from '@core/queue/crons/crons.queue.common';
import { BaseTaskHandler } from '@core/shared/task/task.abstract';
import { Task } from '@core/shared/task/task.decorator';

@Injectable()
export class CronsTaskBullmq extends BaseTaskHandler {
  @Task(CRONS_JOBS.SAMPLE)
  async processSample() {
    console.log('XXxxxXXXXXXXXX');
    console.log(`Cron Test Proccessed`);
    console.log('XXxxxXXXXXXXXX');
  }
}
