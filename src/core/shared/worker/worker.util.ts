import { INestApplicationContext, Provider } from '@nestjs/common';
import { Job, Worker } from 'bullmq';

import { config } from '@core/config';

import QUEUE from './worker.queue';

const redisConfig = config().redis;

function addNamePrefix(name: string) {
  return `worker-${name}`;
}

export function createWorker(app: INestApplicationContext) {
  for (const key of Object.values(QUEUE)) {
    try {
      const handler = app.get(addNamePrefix(key));
      new Worker(
        key,
        async (job: Job) => {
          await handler.dispatch(job);
        },
        { connection: { url: redisConfig.url } },
      );
    } catch (_) {
      console.log('==================================');
      console.log(`Queue handler ${key} not found`);
      console.log('==================================');
      continue;
    }
  }
}

export function createTaskHandler(key: string, clazz: any): Provider {
  return {
    provide: addNamePrefix(key),
    useClass: clazz,
  };
}
