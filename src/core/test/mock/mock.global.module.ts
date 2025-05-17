import { Global, Module, Provider } from '@nestjs/common';

import { LoggerService } from '@core/global/logger/logger.service';
import { TransactionService } from '@core/global/transaction/transaction.service';

const serviceProviders: Provider[] = [TransactionService, LoggerService];

@Global()
@Module({
  providers: serviceProviders,
  exports: serviceProviders,
})
export class MockGlobalModule {}
