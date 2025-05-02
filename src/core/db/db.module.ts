import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';

import { CORE_DB, CoreDB } from './db.common';
import { PrismaProvider } from './db.provider';

@Global()
@Module({
  providers: [PrismaProvider],
  exports: [PrismaProvider],
})
export class DBModule implements OnModuleDestroy {
  constructor(
    @Inject(CORE_DB)
    private readonly db: CoreDB,
  ) {}

  async onModuleDestroy() {
    await this.db.$disconnect();
  }
}
