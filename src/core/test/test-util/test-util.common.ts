import {
  DynamicModule,
  INestApplication,
  Provider,
  Type,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { execSync } from 'child_process';
import { Dayjs } from 'dayjs';
import * as request from 'supertest';

import { config } from '@core/config';
import { CORE_DB, CoreDB } from '@core/db/db.common';
import { DBModule } from '@core/db/db.module';
import { DomainModule } from '@core/domain/domain.module';
import { GlobalModule } from '@core/global/global.module';
import { TransactionService } from '@core/global/transaction/transaction.service';
import { MiddlewareModule } from '@core/middleware/middleware.module';
import { QueueModule } from '@core/queue/queue.module';
import { getConfigOptions } from '@core/shared/common/common.dotenv';
import { Ok } from '@core/shared/common/common.neverthrow';
import { setupApp } from '@core/shared/http/http.setup';

import { AuthsV1Module } from '@app/v1/auths/auths.v1.module';
import { PostAuthsSignInsV1Response } from '@app/v1/auths/dto/post-auths-sign-in/post-auths-sign-in.v1.response';

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
): TestingModuleBuilder;
export function createBackendTestingModule(
  testModule: Array<DynamicModule | Type<any>>,
): TestingModuleBuilder;
export function createBackendTestingModule(
  testModule: DynamicModule | Type<any> | Array<DynamicModule | Type<any>>,
) {
  const testModules = Array.isArray(testModule) ? testModule : [testModule];

  const module = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot(getConfigOptions()),

      DBModule,
      GlobalModule,
      DomainModule,
      MiddlewareModule,
      QueueModule,
      InitialsCliModule,
      AuthsV1Module,
      ...testModules,
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
    execSync('npm run db:deploy');
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

type SeededUser = 'superadmin' | 'general';
export async function getBaseTestHeader(
  app: INestApplication<any>,
  user: SeededUser = 'superadmin',
): Promise<Record<string, string>> {
  const res = await request(app.getHttpServer())
    .post('/v1/auths/sign-in')
    .send({
      email: `${user}@example.com`,
      password: 'password',
    });

  const body: PostAuthsSignInsV1Response = res.body;
  const token = body.data.token;

  return {
    authorization: `Bearer ${token}`,
  };
}
