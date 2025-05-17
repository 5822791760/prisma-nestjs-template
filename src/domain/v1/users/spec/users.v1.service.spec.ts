import { UsersServiceMockFactory } from '@helper/users/mock/users.service.mock';
import { UsersService } from '@helper/users/users.service';
import { NewUserData } from '@helper/users/users.type';
import { Dayjs } from 'dayjs';
import { mock } from 'jest-mock-extended';

import { UsersQueueService } from '@core/queue/users/users.queue.service';
import myDayjs from '@core/shared/common/common.dayjs';
import { errIs } from '@core/shared/common/common.neverthrow';
import { PaginationOptions } from '@core/shared/common/common.pagintaion';
import {
  createTestingModule,
  freezeTestTime,
  mockTransaction,
} from '@core/test/test-util/test-util.common';

import { UsersV1Module } from '../users.v1.module';
import { UsersV1Repo } from '../users.v1.repo';
import { UsersV1Service } from '../users.v1.service';
import { UserDetails } from '../users.v1.type';

describe(`UsersV1Service`, () => {
  const repo = mock<UsersV1Repo>();
  const usersService = mock<UsersService>();
  const usersQueueService = mock<UsersQueueService>();

  let service: UsersV1Service;
  let current: Dayjs;

  beforeAll(async () => {
    current = myDayjs();
    freezeTestTime(current);

    const module = await createTestingModule(UsersV1Module)
      .overrideProvider(UsersV1Repo)
      .useValue(repo)
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideProvider(UsersQueueService)
      .useValue(usersQueueService)
      .compile();

    service = module.get(UsersV1Service);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe(`getUsers`, () => {
    it('works', async () => {
      // Arrange
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'test',
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
        lastSignedInAt: null,
      };

      repo.getPageUsers.mockResolvedValue({
        data: [user],
        totalItems: 1,
      });

      usersQueueService.addJobSample.mockReturnValue();

      // Act
      const options: PaginationOptions = {
        page: 1,
        perPage: 1,
      };
      const r = await service.getUsers(options);

      // Assert
      const expectedData: UserDetails[] = [
        {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      ];
      expect(r.isOk()).toEqual(true);
      expect(r._unsafeUnwrap().data).toEqual(expectedData);
      expect(repo.getPageUsers).toHaveBeenNthCalledWith(1, options);
    });
  });

  describe(`getUsersId`, () => {
    it('works', async () => {
      // Arrange
      const id = 1;

      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'test',
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
        lastSignedInAt: null,
      };

      repo.getOneUser.mockResolvedValue(user);

      // Act
      const r = await service.getUsersId(id);

      // Assert
      const expectedResp: UserDetails = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      };
      expect(r._unsafeUnwrap()).toEqual(expectedResp);
      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, id);
    });

    it('throws UsersV1NotFoundException', async () => {
      // Arrange
      const id = 1;
      repo.getOneUser.mockResolvedValue(null);

      // Act
      const r = await service.getUsersId(1);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'notFound')).toEqual(true);
      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, id);
    });
  });

  describe(`postUsers`, () => {
    it('works', async () => {
      // Arrange
      const userData: NewUserData = {
        email: 'test@example.com',
        password: 'testuser',
      };

      const mockNew = UsersServiceMockFactory.new();
      usersService.new.mockReturnValue(mockNew);

      const mockDbValidate = UsersServiceMockFactory.dbValidate();
      usersService.dbValidate.mockResolvedValue(mockDbValidate);

      const mockDbInsert = UsersServiceMockFactory.dbInsert(1);
      usersService.dbInsert.mockResolvedValue(mockDbInsert);

      mockTransaction(repo);

      // Act
      const r = await service.postUsers(userData);

      // Assert
      expect(r.isOk()).toEqual(true);

      expect(usersService.new).toHaveBeenNthCalledWith(1, userData);
      expect(usersService.dbValidate).toHaveBeenNthCalledWith(1, mockNew);
      expect(usersService.dbInsert).toHaveBeenNthCalledWith(1, mockNew);
    });

    it('throws validation', async () => {
      // Arrange
      const userData: NewUserData = {
        email: 'test@example.com',
        password: 'testuser',
      };

      const mockNew = UsersServiceMockFactory.new();
      usersService.new.mockReturnValue(mockNew);

      const mockDbValidate = UsersServiceMockFactory.dbValidate({ err: true });
      usersService.dbValidate.mockResolvedValue(mockDbValidate);

      // Act
      const r = await service.postUsers(userData);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'validation')).toEqual(true);

      expect(usersService.dbValidate).toHaveBeenNthCalledWith(1, mockNew);
    });
  });
  describe('putUsersId', () => {
    it('works', async () => {
      // Arrange
      const id = 1;

      const mockGetOne = {
        id: 1,
        email: 'old@example.com',
        password: 'password',
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
        lastSignedInAt: null,
      };
      repo.getOneUser.mockResolvedValue(mockGetOne);

      const mockUpdate = UsersServiceMockFactory.update();
      usersService.update.mockReturnValue(mockUpdate);

      const mockDbValidate = UsersServiceMockFactory.dbValidate();
      usersService.dbValidate.mockResolvedValue(mockDbValidate);

      usersService.dbUpdate.mockResolvedValue();

      mockTransaction(repo);

      // Act
      const body = { email: 'test@example.com', password: 'test' };
      const r = await service.putUsersId(body, id);

      // Assert
      expect(r.isOk()).toEqual(true);

      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, id);
      expect(usersService.update).toHaveBeenNthCalledWith(1, mockGetOne, body);
      expect(usersService.dbValidate).toHaveBeenNthCalledWith(
        1,
        mockUpdate,
        id,
      );
      expect(usersService.dbUpdate).toHaveBeenNthCalledWith(1, mockUpdate);
    });

    it('throws validation', async () => {
      // Arrange
      const id = 1;

      const mockGetOne = {
        id: 1,
        email: 'old@example.com',
        password: 'password',
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
        lastSignedInAt: null,
      };
      repo.getOneUser.mockResolvedValue(mockGetOne);

      const mockUpdate = UsersServiceMockFactory.update();
      usersService.update.mockReturnValue(mockUpdate);

      const mockDbValidate = UsersServiceMockFactory.dbValidate({
        err: true,
      });
      usersService.dbValidate.mockResolvedValue(mockDbValidate);

      // Act
      const body = { email: 'test@example.com', password: 'test' };
      const r = await service.putUsersId(body, id);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'validation')).toEqual(true);

      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, id);
      expect(usersService.update).toHaveBeenNthCalledWith(1, mockGetOne, body);
      expect(usersService.dbValidate).toHaveBeenNthCalledWith(
        1,
        mockUpdate,
        id,
      );
    });

    it('throws notFound', async () => {
      // Arrange
      const id = 1;

      const mockGetOne = null;
      repo.getOneUser.mockResolvedValue(mockGetOne);

      // Act
      const body = { email: 'test@example.com', password: 'test' };
      const r = await service.putUsersId(body, id);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'notFound')).toEqual(true);

      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, id);
    });
  });
});
