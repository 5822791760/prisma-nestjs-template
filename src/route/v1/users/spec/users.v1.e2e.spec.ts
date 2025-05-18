import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { createBackendTestingModule } from '@core/test/test-util/test-util.common';

import { UsersV1Module } from '../users.v1.module';

describe(`UsersV1Service`, () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mod = await createBackendTestingModule(UsersV1Module);
    app = mod.app;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /v1/users', () => {
    it('works', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/users')
        .query({ page: 1, perPage: 10 });

      expect(res.status).toBe(200);
    });
  });
});
