import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthHttp } from './handler/health.http';

@Module({
  imports: [TerminusModule],
  controllers: [HealthHttp],
})
export class HealthModule {}
