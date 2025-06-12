import { Module } from '@nestjs/common';

import { UsersV1Http } from './handler/users.v1.http';
import { UsersV1Repo } from './users.v1.repo';
import { UsersV1Service } from './users.v1.service';

@Module({
  providers: [UsersV1Service, UsersV1Repo],
  controllers: [UsersV1Http],
})
export class UsersV1Module {}
