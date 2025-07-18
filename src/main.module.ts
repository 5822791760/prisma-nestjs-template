import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DBModule } from '@core/db/db.module';
import { DomainModule } from '@core/domain/domain.module';
import { GlobalModule } from '@core/global/global.module';
import { QueueModule } from '@core/queue/queue.module';
import { getConfigOptions } from '@core/shared/common/common.dotenv';

import { AppModule } from '@app/app.module';

import { CliModule } from './cli/cli.module';
import { MiddlewareModule } from './core/middleware/middleware.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    // Global
    ConfigModule.forRoot(getConfigOptions()),

    DBModule,
    GlobalModule,
    DomainModule,
    MiddlewareModule,
    AppModule,
    QueueModule,
  ],
})
export class MainAppModule {}

@Module({
  imports: [
    // Global
    ConfigModule.forRoot(getConfigOptions()),

    DBModule,
    GlobalModule,
    DomainModule,
    TaskModule,
  ],
})
export class MainWorkerModule {}

@Module({
  imports: [
    // Global
    ConfigModule.forRoot(getConfigOptions()),

    DBModule,
    GlobalModule,
    DomainModule,
    CliModule,
  ],
})
export class MainCliModule {}
