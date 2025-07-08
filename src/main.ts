import { NestFactory } from '@nestjs/core';

import { config } from '@core/config';
import { coreLogger } from '@core/shared/common/common.logger';
import { setupApp, setupSwagger } from '@core/shared/http/http.setup';

import { MainAppModule } from './main.module';

const appConfig = config().app;

async function bootstrap() {
  const app = await NestFactory.create(MainAppModule, {
    logger: coreLogger(appConfig),
  });

  setupApp(app);

  if (appConfig.enableSwagger) {
    setupSwagger(app);
  }

  app.enableShutdownHooks();
  await app.listen(appConfig.port);
}
bootstrap();
