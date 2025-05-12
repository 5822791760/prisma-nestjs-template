import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, JobsOptions, Queue } from 'bullmq';

import { AppConfig } from '@core/config';
import { LoggerService } from '@core/global/logger/logger.service';
import { QueueBoard } from '@core/queue/queue.board';

import { TaskMetadata, getTaskHandlers } from './worker.decorator';
import { QUEUE } from './worker.queue';

@Injectable()
export abstract class BaseQueue implements OnModuleInit {
  abstract queueName: QUEUE;
  protected queue: Queue;

  constructor(
    private readonly configService: ConfigService,
    private readonly bullboardService: QueueBoard,
    private readonly loggerService: LoggerService,
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
  private _taskMap: Record<string, TaskMetadata>;

  constructor() {
    this._taskMap = getTaskHandlers(this);
  }

  async dispatch(job: Job): Promise<void> {
    const metadata = this._taskMap[job.name];
    if (!metadata) {
      throw new Error(`metadata for job ${job.name} not found!`);
    }

    const methodName = metadata.methodName;
    if (!methodName) {
      // this should never happen, but handle just in case
      throw new Error(`unexpected: method name for ${job.name} not found`);
    }

    // handle task pipe
    const zodSchema = metadata.schema;
    if (zodSchema) {
      job.data = zodSchema.parse(job.data);
    }

    // handle task
    const method = (this as any)[methodName];
    if (method && typeof method === 'function') {
      await method(job.data);
    }
  }
}
