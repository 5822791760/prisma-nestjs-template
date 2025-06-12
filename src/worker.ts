import { NestFactory } from '@nestjs/core';

import { createWorker } from '@core/shared/common/common.worker';

import { MainWorkerModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MainWorkerModule);

  createWorker(app);
}
bootstrap();
