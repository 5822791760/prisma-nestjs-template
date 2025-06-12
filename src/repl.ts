import { repl } from '@nestjs/core';

import { MainAppModule } from './main.module';

async function bootstrap() {
  await repl(MainAppModule);
}
bootstrap();
