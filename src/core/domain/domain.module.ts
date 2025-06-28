import { Global, Module } from '@nestjs/common';

import { DOMAIN_PROVIDER } from './domain.provider';

@Global()
@Module({
  providers: DOMAIN_PROVIDER,
  exports: DOMAIN_PROVIDER,
})
export class DomainModule {}
