import { Dayjs } from 'dayjs';
import { mock } from 'jest-mock-extended';

import { hashString } from '@core/shared/common/common.crypto';
import tzDayjs from '@core/shared/common/common.dayjs';
import { errIs } from '@core/shared/common/common.neverthrow';
import {
  createTestingModule,
  freezeTestTime,
  mockTransaction,
} from '@core/test/test-util/test-util.common';

import { AuthsV1Module } from '../auths.v1.module';
import { AuthsV1Repo } from '../auths.v1.repo';
import { AuthsV1Service } from '../auths.v1.service';
import { SignInUserData } from '../auths.v1.type';

describe('AuthsV1Service', () => {
  const repo = mock<AuthsV1Repo>();

  let service: AuthsV1Service;
  let current: Dayjs;

  beforeAll(async () => {
    current = tzDayjs();
    freezeTestTime(current);

    const module = await createTestingModule(AuthsV1Module)
      .overrideProvider(AuthsV1Repo)
      .useValue(repo)
      .compile();

    service = module.get(AuthsV1Service);
  });

  describe('postAuthsSignIns', () => {
    it('works', async () => {
      // Arrange
      repo.getOneUser.mockResolvedValue({
        id: 1,
        email: 'test@exmaple.com',
        password: hashString('password'),
        lastSignedInAt: null,
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
        posts: [],
      });
      mockTransaction(repo);
      repo.updateUser.mockResolvedValue(undefined);

      const data: SignInUserData = {
        email: 'test@example.com',
        password: 'password',
      };

      // Act
      const r = await service.postAuthsSignIns(data);

      // Assert
      expect(r.isOk()).toEqual(true);
      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, data.email);
      expect(repo.updateUser).toHaveBeenNthCalledWith(1, {
        id: 1,
        email: 'test@exmaple.com',
        password: expect.any(String),
        lastSignedInAt: current.toDate(),
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
        posts: [],
      });
    });

    it('throws notFound', async () => {
      // Arrange
      repo.getOneUser.mockResolvedValue(null);

      const data: SignInUserData = {
        email: 'test@example.com',
        password: 'password',
      };

      // Act
      const r = await service.postAuthsSignIns(data);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'notFound')).toEqual(true);
    });

    it('throws invalidPassword', async () => {
      // Arrange
      repo.getOneUser.mockResolvedValue({
        id: 1,
        email: 'test@exmaple.com',
        password: hashString('password'),
        lastSignedInAt: null,
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
        posts: [],
      });

      const data: SignInUserData = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      // Act
      const r = await service.postAuthsSignIns(data);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'invalidPassword')).toEqual(true);
    });
  });
});
