import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';

import { AppConfig } from '@core/config';
import { UsePublic } from '@core/middleware/jwt/jwt.common';

import { GetHealthResponse } from './dto/get-health.dto';

@ApiTags('health')
@Controller('health')
export class HealthHttpController {
  constructor(
    private health: HealthCheckService,
    private memIndicator: MemoryHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @UsePublic()
  async getHealth(): Promise<GetHealthResponse> {
    const appConfig = this.configService.getOrThrow<AppConfig['app']>('app');

    const data = await this.health.check([
      () => this.memIndicator.checkHeap('heap', appConfig.memThreshold),
      // () => this.memIndicator.checkRSS('rss', appConfig.memThreshold),
      // () => this.db.pingCheck('database'),
    ]);

    return {
      success: true,
      key: 'health status up',
      data: {
        heap: data?.info?.heap.status || '',
        // rss: data.info.rss.status,
        // db: data?.info?.db.status || '',
      },
    };
  }
}
