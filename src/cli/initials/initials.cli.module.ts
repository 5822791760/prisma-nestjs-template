import { Module } from '@nestjs/common';

import { InitialsCliSeed } from './cmd/initials.cli.seed';
import { InitialsCliRepo } from './initials.cli.repo';

@Module({
  providers: [InitialsCliSeed, InitialsCliRepo],
})
export class InitialsCliModule {}
