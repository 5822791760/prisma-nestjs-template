import { Global, Module, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { DataSourceProvider } from './db.provider';

@Global()
@Module({
  providers: [DataSourceProvider],
  exports: [DataSourceProvider],
})
export class DBModule implements OnModuleDestroy {
  constructor(private readonly db: DataSource) {}

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
