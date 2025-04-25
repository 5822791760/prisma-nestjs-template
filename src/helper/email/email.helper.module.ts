import { Module } from '@nestjs/common';

import { NodeMailerProvider } from './email.helper.provider';
import { EmailHelperService } from './email.helper.service';

@Module({
  providers: [NodeMailerProvider, EmailHelperService],
  exports: [EmailHelperService],
})
export class EmailHelperModule {}
