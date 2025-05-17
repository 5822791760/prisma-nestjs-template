import { AuthsModule } from '@helper/auths/auths.module';
import { UsersModule } from '@helper/users/users.module';
import { Module } from '@nestjs/common';

import { AuthsV1Repo } from './auths.v1.repo';
import { AuthsV1Service } from './auths.v1.service';
import { AuthsV1HttpController } from './handler/http/auths.v1.http.controller';

@Module({
  imports: [AuthsModule, UsersModule],
  providers: [AuthsV1Repo, AuthsV1Service],
  controllers: [AuthsV1HttpController],
})
export class AuthsV1Module {}
