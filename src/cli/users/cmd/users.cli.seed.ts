import { faker } from '@faker-js/faker';
import { Command, CommandRunner, Option } from 'nest-commander';

import { UsersRepo } from '@core/domain/users/users.repo';
import { UsersService } from '@core/domain/users/users.service';
import { UserData } from '@core/domain/users/users.type';
import { DEFAULT_PASSWORD } from '@core/shared/common/common.constant';

import { UsersCliRepo } from '../users.cli.repo';

interface CommandOptions {
  amount: number;
}

@Command({
  name: 'users:seed',
  description: 'Create record in users table',
})
export class UsersCliSeed extends CommandRunner {
  constructor(
    private repo: UsersCliRepo,
    private usersRepo: UsersRepo,
    private usersService: UsersService,
  ) {
    super();
  }

  async run(_passedParams: string[], options: CommandOptions): Promise<void> {
    const data: UserData[] = [];

    for (let i = 0; i < options.amount; i++) {
      data.push(
        this.usersService.new({
          email: faker.internet.email(),
          password: DEFAULT_PASSWORD,
        }),
      );
    }

    await this.repo.transaction(async () => {
      await this.usersRepo.createMany(data);
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
