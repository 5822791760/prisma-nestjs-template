import { Module } from '@nestjs/common';

import { UsersV1HttpController } from './handler/users.v1.http.controller';
import { UsersV1Repo } from './users.v1.repo';
import { UsersV1Service } from './users.v1.service';

@Module({
  providers: [UsersV1Service, UsersV1Repo],
  controllers: [UsersV1HttpController],
})
export class UsersV1Module {}
