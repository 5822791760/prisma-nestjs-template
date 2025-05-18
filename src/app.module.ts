import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouteModule } from 'src/route/route.module';

import { config } from '@core/config';
import { DBModule } from '@core/db/db.module';
import { DomainModule } from '@core/domain/domain.module';
import { GlobalModule } from '@core/global/global.module';
import { QueueModule } from '@core/queue/queue.module';

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
    DomainModule,
    MiddlewareModule,
    RouteModule,
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
    DomainModule,
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
    DomainModule,
    CliModule,
  ],
})
export class CliAppModule {}
