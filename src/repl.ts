import { repl } from '@nestjs/core';

import { MainAppModule } from './app.module';

async function bootstrap() {
  await repl(MainAppModule);
}
bootstrap();
