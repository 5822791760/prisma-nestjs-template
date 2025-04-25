import { Global, Module, Provider } from '@nestjs/common';

import { TransactionService } from '@core/global/transaction/transaction.service';

const serviceProviders: Provider[] = [TransactionService];

@Global()
@Module({
  providers: serviceProviders,
  exports: serviceProviders,
})
export class MockGlobalModule {}
