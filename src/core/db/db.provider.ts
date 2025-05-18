import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '@core/config';

import { CORE_DB } from './db.common';
import { getPrisma } from './db.prisma';

export const PrismaProvider: Provider = {
  provide: CORE_DB,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) =>
    getPrisma(configService.getOrThrow<AppConfig['database']>('database')),
};
