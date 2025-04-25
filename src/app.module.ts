import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from '@core/config';
import { DBModule } from '@core/db/db.module';
import { GlobalModule } from '@core/global/global.module';
import { QueueModule } from '@core/queue/queue.module';

import { DomainModule } from '@domain/domain.module';

import { CliModule } from './cli/cli.module';
import { MiddlewareModule } from './core/middleware/middleware.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    // Global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    DBModule,
    GlobalModule,
    MiddlewareModule,
    DomainModule,
    QueueModule,
  ],
})
export class MainAppModule {}

@Module({
  imports: [
    // Global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    DBModule,
    GlobalModule,
    TaskModule,
  ],
})
export class WorkerAppModule {}

@Module({
  imports: [
    // Global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    DBModule,
    GlobalModule,
    CliModule,
  ],
})
export class CliAppModule {}
