import { Module } from '@nestjs/common';

import { RedisCacheProvider } from './cache.helper.provider';
import { CacheHelperService } from './cache.helper.service';

@Module({
  providers: [RedisCacheProvider, CacheHelperService],
  exports: [CacheHelperService],
})
export class CacheHelperModule {}
