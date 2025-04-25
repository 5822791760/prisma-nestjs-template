import { Global, Module, Provider } from '@nestjs/common';

import { CoreDB } from '@core/db/db.common';

const MockPrismaProvider: Provider = {
  provide: CoreDB,
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
