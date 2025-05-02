import { Global, Module, Provider } from '@nestjs/common';

import { CORE_DB } from '@core/db/db.common';

const MockPrismaProvider: Provider = {
  provide: CORE_DB,
  useValue: {
    transaction: jest.fn().mockImplementation(() => ({
      execute: jest.fn(),
    })),
  },
};

@Global()
@Module({
  providers: [MockPrismaProvider],
  exports: [MockPrismaProvider],
})
export class MockDBModule {}
