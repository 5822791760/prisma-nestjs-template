import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { RedisClientType } from 'redis';

import { REDIS_CLIENT } from './cache/cache.provider';
import { GLOBAL_PROVIDER } from './global.provider';

@Global()
@Module({
  providers: GLOBAL_PROVIDER,
  exports: GLOBAL_PROVIDER,
})
export class GlobalModule implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClientType,
  ) {}

  async onModuleDestroy() {
    // close redis
    if (this.redisClient.isOpen) {
      await this.redisClient.disconnect();
    }
  }
}
