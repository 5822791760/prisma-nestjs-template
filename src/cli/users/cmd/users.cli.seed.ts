import { faker } from '@faker-js/faker';
import { Command, CommandRunner, Option } from 'nest-commander';

import { DEFAULT_PASSWORD } from '@core/shared/common/common.constant';
import { hashString } from '@core/shared/common/common.crypto';
import myDayjs from '@core/shared/common/common.dayjs';

import { UsersCliRepo } from '../users.cli.repo';
import { NewUser } from '../users.cli.type';

interface CommandOptions {
  amount: number;
}

@Command({
  name: 'users:seed',
  description: 'Create record in users table',
})
export class UsersCliSeed extends CommandRunner {
  constructor(private repo: UsersCliRepo) {
    super();
  }

  async run(_passedParams: string[], options: CommandOptions): Promise<void> {
    const data: NewUser[] = [];

    for (let i = 0; i < options.amount; i++) {
      data.push({
        email: faker.internet.email(),
        password: hashString(DEFAULT_PASSWORD),
        createdAt: myDayjs().toDate(),
        updatedAt: myDayjs().toDate(),
      });
    }

    await this.repo.transaction(async () => {
      this.repo.db.users.createMany({ data });
    });
  }

  @Option({
    flags: '-a, --amount [number]',
    defaultValue: '1',
    description: 'Amount of data to insert',
  })
  parseAmount(val: string): number {
    return Number(val) || 1;
  }
}
