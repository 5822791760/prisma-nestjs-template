import { CommandFactory } from 'nest-commander';

import { MainCliModule } from './main.module';

async function bootstrap() {
  const app = await CommandFactory.createWithoutRunning(MainCliModule, {
    // if true this will fail silently
    abortOnError: false,
  });
  await CommandFactory.runApplication(app);
  await app.close();
}
bootstrap();
