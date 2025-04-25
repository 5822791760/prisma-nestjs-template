import { NestFactory } from '@nestjs/core';

import { createWorker } from '@core/shared/worker/worker.util';

import { WorkerAppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerAppModule);

  createWorker(app);
}
bootstrap();
