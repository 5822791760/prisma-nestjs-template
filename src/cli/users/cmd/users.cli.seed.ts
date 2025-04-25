import { faker } from '@faker-js/faker';
import { Command, CommandRunner, Option } from 'nest-commander';

import { Users } from '@core/db/entities/Users';
import { DEFAULT_PASSWORD } from '@core/shared/common/common.constant';
import { hashString } from '@core/shared/common/common.crypto';
import tzDayjs from '@core/shared/common/common.dayjs';

import { UsersCliRepo } from '../users.cli.repo';

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
    const users: Users[] = [];

    for (let i = 0; i < options.amount; i++) {
      users.push(
        this.repo.from(Users).create({
          email: faker.internet.email(),
          password: hashString(DEFAULT_PASSWORD),
          createdAt: tzDayjs().toDate(),
          updatedAt: tzDayjs().toDate(),
        }),
      );
    }

    await this.repo.transaction(async () => {
      this.repo.from(Users).insert(users);
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
