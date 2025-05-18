import { Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Dayjs } from 'dayjs';

import { CORE_DB } from '@core/db/db.common';
import { TransactionService } from '@core/global/transaction/transaction.service';
import { Ok } from '@core/shared/common/common.neverthrow';
import { setupApp } from '@core/shared/http/http.setup';

import { config } from '../test-config';

export function mockTransaction(
  mockRepo: { transaction: jest.Mock },
  mockResponse?: any,
) {
  mockRepo.transaction.mockImplementation(async (txCallback) => {
    const res = await txCallback();
    return mockResponse || Ok(res);
  });
}

export function createTestingModule(providers: Provider[]) {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [config],
      }),
    ],
    providers,
  });
}

export async function setupAppForTest(testModule: TestingModule) {
  const app = testModule.createNestApplication();

  setupApp(app);

  await app.init();

  return app;
}

export async function createRepoTestingModule(repo: Provider) {
  const module = await Test.createTestingModule({
    providers: [
      repo,
      TransactionService,
      {
        provide: CORE_DB,
        useFactory: async () => {
          return globalThis.dataSource;
        },
      },
    ],
  }).compile();

  return module;
}

export function freezeTestTime(current: Dayjs) {
  jest.useFakeTimers().setSystemTime(current.toDate());
}
