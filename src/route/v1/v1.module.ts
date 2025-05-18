import { Module } from '@nestjs/common';

import { AuthsV1Module } from './auths/auths.v1.module';
import { UsersV1Module } from './users/users.v1.module';

@Module({
  imports: [UsersV1Module, AuthsV1Module],
})
export class V1Module {}
