import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { CoreContextInterceptor } from '@core/middleware/core-context/core-context.interceptor';

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CoreContextInterceptor,
    },
  ],
})
export class MockMiddlewareModule {}
