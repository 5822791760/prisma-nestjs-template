import { Global, Module } from '@nestjs/common';

import { QUEUE_PROVIDER } from './queue.provider';

@Global()
@Module({
  providers: QUEUE_PROVIDER,
  exports: QUEUE_PROVIDER,
})
export class QueueModule {}
