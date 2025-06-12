import { Module } from '@nestjs/common';

import { AuthsV1Repo } from './auths.v1.repo';
import { AuthsV1Service } from './auths.v1.service';
import { AuthsV1HttpController } from './handler/auths.v1.http.controller';

@Module({
  providers: [AuthsV1Repo, AuthsV1Service],
  controllers: [AuthsV1HttpController],
})
export class AuthsV1Module {}
