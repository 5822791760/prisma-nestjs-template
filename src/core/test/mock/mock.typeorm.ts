import { Global, Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

const MockDataSourceProvider: Provider = {
  provide: DataSource,
  useValue: {
    transaction: jest.fn().mockImplementation(() => ({
      execute: jest.fn(),
    })),
  },
};

@Global()
@Module({
  providers: [MockDataSourceProvider],
  exports: [MockDataSourceProvider],
})
export class MockDBModule {}
