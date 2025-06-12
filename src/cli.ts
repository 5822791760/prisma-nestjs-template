import { CommandFactory } from 'nest-commander';

import { MainCliModule } from './main.module';

async function bootstrap() {
  const app = await CommandFactory.createWithoutRunning(MainCliModule);
  await CommandFactory.runApplication(app);
  await app.close();
}
bootstrap();
