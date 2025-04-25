import { Global, Module, OnModuleDestroy } from '@nestjs/common';

import { CoreDB } from './db.common';
import { PrismaProvider } from './db.provider';

@Global()
@Module({
  providers: [PrismaProvider],
  exports: [PrismaProvider],
})
export class DBModule implements OnModuleDestroy {
  constructor(private readonly db: CoreDB) {}

  async onModuleDestroy() {
    await this.db.$disconnect();
  }
}
