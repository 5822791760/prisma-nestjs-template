import { Module } from '@nestjs/common';

import { GenCliApi } from './cmd/gen.cli.api';
import { GenCliDomain } from './cmd/gen.cli.domain';
import { GenCliRepo } from './gen.cli.repo';

@Module({
  providers: [GenCliApi, GenCliRepo, GenCliDomain],
})
export class GenCliModule {}
