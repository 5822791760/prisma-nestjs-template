import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  createBackendTestingModule,
  endTestApp,
  startTestApp,
} from '@core/test/test-util/test-util.common';

import { UsersV1Module } from '../users.v1.module';

describe(`UsersV1Module`, () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await createBackendTestingModule(UsersV1Module).compile();
    app = await startTestApp(module);
  });

  afterAll(async () => {
    await endTestApp(app);
  });

  describe('GET /v1/users', () => {
    it('works', async () => {
      await request(app.getHttpServer())
        .get('/v1/users')
        .query({ page: 1, perPage: 10 })
        .expect(({ status }) => {
          expect(status).toBe(200);
        });
    });
  });
});
