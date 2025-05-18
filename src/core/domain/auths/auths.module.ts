import { Module } from '@nestjs/common';

import { AuthsService } from './auths.service';

@Module({
  providers: [AuthsService],
  exports: [AuthsService],
})
export class AuthsModule {}
