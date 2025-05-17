import { AuthsService } from '@helper/auths/auths.service';
import { AuthsServiceMockFactory } from '@helper/auths/mock/auths.service.mock';
import { UsersServiceMockFactory } from '@helper/users/mock/users.service.mock';
import { UsersService } from '@helper/users/users.service';
import { Dayjs } from 'dayjs';
import { mock } from 'jest-mock-extended';

import myDayjs from '@core/shared/common/common.dayjs';
import { Err, errIs } from '@core/shared/common/common.neverthrow';
import {
  createTestingModule,
  freezeTestTime,
  mockTransaction,
} from '@core/test/test-util/test-util.common';

import { AuthsV1Module } from '../auths.v1.module';
import { AuthsV1Repo } from '../auths.v1.repo';
import { AuthsV1Service } from '../auths.v1.service';

describe('AuthsV1Service', () => {
  const repo = mock<AuthsV1Repo>();
  const usersService = mock<UsersService>();
  const authsService = mock<AuthsService>();

  let service: AuthsV1Service;
  let current: Dayjs;

  beforeAll(async () => {
    current = myDayjs();
    freezeTestTime(current);

    const module = await createTestingModule(AuthsV1Module)
      .overrideProvider(AuthsV1Repo)
      .useValue(repo)
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideProvider(AuthsService)
      .useValue(authsService)
      .compile();

    service = module.get(AuthsV1Service);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('postAuthsSignIns', () => {
    it('works', async () => {
      // Arrange
      const body = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockGetOneUser = {
        id: 1,
        email: 'test@exmaple.com',
        password: 'password',
        lastSignedInAt: null,
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
      };
      repo.getOneUser.mockResolvedValue(mockGetOneUser);

      const mockSignIn = UsersServiceMockFactory.signIn({ data: body });
      const mockSignInValue = mockSignIn._unsafeUnwrap();
      usersService.signIn.mockReturnValue(mockSignIn);

      usersService.dbUpdate.mockResolvedValue();

      const mockGenerateToken = AuthsServiceMockFactory.generateToken();
      authsService.generateToken.mockReturnValue(mockGenerateToken);

      mockTransaction(repo);

      // Act
      const r = await service.postAuthsSignIns(body);

      // Assert
      expect(r.isOk()).toEqual(true);

      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, body.email);
      expect(usersService.signIn).toHaveBeenNthCalledWith(
        1,
        mockGetOneUser,
        body.password,
      );
      expect(usersService.dbUpdate).toHaveBeenNthCalledWith(1, mockSignInValue);
      expect(authsService.generateToken).toHaveBeenNthCalledWith(
        1,
        mockSignInValue,
      );
    });

    it('throw notFound', async () => {
      // Arrange
      const body = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockGetOneUser = null;
      repo.getOneUser.mockResolvedValue(mockGetOneUser);

      // Act
      const r = await service.postAuthsSignIns(body);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'notFound')).toEqual(true);

      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, body.email);
    });

    it('throw invalidPassword', async () => {
      // Arrange
      const body = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockGetOneUser = {
        id: 1,
        email: 'test@exmaple.com',
        password: 'password',
        lastSignedInAt: null,
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
      };
      repo.getOneUser.mockResolvedValue(mockGetOneUser);

      const mockSignIn = UsersServiceMockFactory.signIn({ err: true });
      usersService.signIn.mockReturnValue(mockSignIn);

      // Act
      const r = await service.postAuthsSignIns(body);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'invalidPassword')).toEqual(true);

      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, body.email);
      expect(usersService.signIn).toHaveBeenNthCalledWith(
        1,
        mockGetOneUser,
        body.password,
      );
    });
  });

  describe('postAuthsSignUps', () => {
    it('works', async () => {
      // Arrange
      const body = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockDbValidate = UsersServiceMockFactory.dbValidate();
      usersService.dbValidate.mockResolvedValue(mockDbValidate);

      const mockNew = UsersServiceMockFactory.new(body);
      usersService.new.mockReturnValue(mockNew);

      const mockSignIn = UsersServiceMockFactory.signIn();
      const mockSignInValue = mockSignIn._unsafeUnwrap();
      usersService.signIn.mockReturnValue(mockSignIn);

      const mockDbInsert = UsersServiceMockFactory.dbInsert(1);
      usersService.dbInsert.mockResolvedValue(mockDbInsert);

      const mockGenerateToken = AuthsServiceMockFactory.generateToken();
      authsService.generateToken.mockReturnValue(mockGenerateToken);

      mockTransaction(repo);

      // Act
      const r = await service.postAuthsSignUps(body);

      // Assert
      expect(r.isOk()).toEqual(true);

      expect(usersService.dbValidate).toHaveBeenNthCalledWith(1, {
        email: body.email,
      });
      expect(usersService.new).toHaveBeenNthCalledWith(1, body);
      expect(usersService.signIn).toHaveBeenNthCalledWith(
        1,
        mockNew,
        body.password,
      );
      expect(usersService.dbInsert).toHaveBeenNthCalledWith(1, mockSignInValue);
      expect(authsService.generateToken).toHaveBeenNthCalledWith(
        1,
        mockDbInsert,
      );
    });

    it('throw validation', async () => {
      // Arrange
      const body = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockDbValidate = UsersServiceMockFactory.dbValidate({ err: true });
      usersService.dbValidate.mockResolvedValue(mockDbValidate);

      // Act
      const r = await service.postAuthsSignUps(body);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'validation')).toEqual(true);
      expect(usersService.dbValidate).toHaveBeenNthCalledWith(1, {
        email: body.email,
      });
    });

    it('throw validation', async () => {
      // Arrange
      const body = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockDbValidate = UsersServiceMockFactory.dbValidate();
      usersService.dbValidate.mockResolvedValue(mockDbValidate);

      const mockNew = UsersServiceMockFactory.new(body);
      usersService.new.mockReturnValue(mockNew);

      const mockSignIn = UsersServiceMockFactory.signIn({ err: true });
      usersService.signIn.mockReturnValue(mockSignIn);

      // Act
      const r = await service.postAuthsSignUps(body);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'validation')).toEqual(true);

      expect(usersService.dbValidate).toHaveBeenNthCalledWith(1, {
        email: body.email,
      });
      expect(usersService.new).toHaveBeenNthCalledWith(1, body);
      expect(usersService.signIn).toHaveBeenNthCalledWith(
        1,
        mockNew,
        body.password,
      );
    });

    it('throw internal', async () => {
      // Arrange
      const body = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockDbValidate = UsersServiceMockFactory.dbValidate();
      usersService.dbValidate.mockResolvedValue(mockDbValidate);

      const mockNew = UsersServiceMockFactory.new(body);
      usersService.new.mockReturnValue(mockNew);

      const mockSignIn = UsersServiceMockFactory.signIn();
      const mockSignInValue = mockSignIn._unsafeUnwrap();
      usersService.signIn.mockReturnValue(mockSignIn);

      const mockDbInsert = UsersServiceMockFactory.dbInsert(1);
      usersService.dbInsert.mockResolvedValue(mockDbInsert);

      mockTransaction(repo, Err('internal'));

      // Act
      const r = await service.postAuthsSignUps(body);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'internal')).toEqual(true);

      expect(usersService.dbValidate).toHaveBeenNthCalledWith(1, {
        email: body.email,
      });
      expect(usersService.new).toHaveBeenNthCalledWith(1, body);
      expect(usersService.signIn).toHaveBeenNthCalledWith(
        1,
        mockNew,
        body.password,
      );
      expect(usersService.dbInsert).toHaveBeenNthCalledWith(1, mockSignInValue);
    });
  });
});
