import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { Queue } from 'bullmq';

import { AppConfig } from '@core/config';

@Injectable()
export class QueueBoard implements OnModuleInit {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  allQueues: Queue[] = [];

  onModuleInit() {
    const http = this.adapterHost.httpAdapter?.getInstance();
    if (!http) {
      // If not api module do nothing
      return;
    }

    const appConfg = this.configService.getOrThrow<AppConfig['app']>('app');
    if (!appConfg.enableBullboard) {
      return;
    }

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/docs/queues');

    createBullBoard({
      queues: this.allQueues.map((q) => new BullMQAdapter(q)),
      serverAdapter,
    });

    http.use('/docs/queues', serverAdapter.getRouter());
  }

  addQueue(queue: Queue) {
    this.allQueues.push(queue);
  }
}
