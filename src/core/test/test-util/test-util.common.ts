import {
  DynamicModule,
  INestApplication,
  Provider,
  Type,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'child_process';
import { Dayjs } from 'dayjs';

import { config } from '@core/config';
import { CORE_DB, CoreDB } from '@core/db/db.common';
import { DBModule } from '@core/db/db.module';
import { DomainModule } from '@core/domain/domain.module';
import { GlobalModule } from '@core/global/global.module';
import { TransactionService } from '@core/global/transaction/transaction.service';
import { MiddlewareModule } from '@core/middleware/middleware.module';
import { QueueModule } from '@core/queue/queue.module';
import { Ok } from '@core/shared/common/common.neverthrow';
import { setupApp } from '@core/shared/http/http.setup';

import { InitialsCliSeed } from '../../../cli/initials/cmd/initials.cli.seed';
import { InitialsCliModule } from '../../../cli/initials/initials.cli.module';
import { getTestState, updateTestState } from './test-state.common';

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

export function createBackendTestingModule(
  testModule: DynamicModule | Type<any>,
) {
  const module = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [config],
      }),

      testModule,
      DBModule,
      GlobalModule,
      DomainModule,
      MiddlewareModule,
      QueueModule,
      InitialsCliModule,
    ],
  });

  return module;
}

export function freezeTestTime(current: Dayjs) {
  jest.useFakeTimers().setSystemTime(current.toDate());
}

export async function startTestApp(module: TestingModule) {
  const app = module.createNestApplication();
  setupApp(app);
  await app.init();

  const { requireDbSetup } = getTestState();

  if (requireDbSetup) {
    execSync('yarn db:deploy');
    await app.get(InitialsCliSeed).run([]);
    updateTestState({ requireDbSetup: false });
  }

  const db = app.get<CoreDB>(CORE_DB);
  const transactionService = app.get<TransactionService>(TransactionService);

  const tx = await db.$begin();
  transactionService.setTransaction(tx);

  return app;
}

export async function endTestApp(app: INestApplication<any>) {
  const transactionService = app.get<TransactionService>(TransactionService);
  const tx = transactionService.getTransaction();

  await tx.$rollback();
  transactionService.clearTransaction();

  await app.close();

  return;
}
