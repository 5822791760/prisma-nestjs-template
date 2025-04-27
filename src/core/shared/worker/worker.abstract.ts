import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, JobsOptions, Queue } from 'bullmq';

import { AppConfig } from '@core/config';
import { QueueBoard } from '@core/queue/queue.board';

import { getTaskHandlers } from './worker.decorator';
import { IQUEUE } from './worker.queue';

@Injectable()
export abstract class BaseQueue implements OnModuleInit {
  abstract queueName: IQUEUE;
  protected queue: Queue;

  constructor(
    private readonly configService: ConfigService,
    private readonly bullboardService: QueueBoard,
  ) {}

  onModuleInit() {
    const redisConfig =
      this.configService.getOrThrow<AppConfig['redis']>('redis');

    this.queue = new Queue(this.queueName, {
      connection: { url: redisConfig.url },
    });

    this.bullboardService.addQueue(this.queue);
  }

  addJob(name: string, data: any) {
    this.queue.add(name, data, this._getQueueConfig());
  }

  protected _getQueueConfig(): JobsOptions {
    return {
      removeOnComplete: 20,
      removeOnFail: 50,
    };
  }
}

export abstract class BaseCronQueue extends BaseQueue {
  abstract setupCron(): void;

  addCron(name: string, pattern: string, data?: any) {
    // has job id to prevent duplicates
    // for horizontal scale
    this.queue.add(name, data, {
      repeat: { pattern },
      jobId: name,
      ...this._getQueueConfig(),
    });
  }

  onModuleInit(): void {
    super.onModuleInit();
    this.setupCron();
  }
}

@Injectable()
export abstract class BaseTaskHandler {
  private _taskMap: Record<string, string>;

  constructor() {
    this._taskMap = getTaskHandlers(this);
  }

  async dispatch(job: Job): Promise<void> {
    const methodKey = this._taskMap[job.name];
    if (methodKey && typeof (this as any)[methodKey] === 'function') {
      await (this as any)[methodKey](job.data);
    }
  }
}
