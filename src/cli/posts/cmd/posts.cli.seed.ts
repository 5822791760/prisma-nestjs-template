import { faker } from '@faker-js/faker';
import { Command, CommandRunner, Option } from 'nest-commander';

import myDayjs from '@core/shared/common/common.dayjs';
import { getRandomId } from '@core/shared/common/common.func';

import { PostsCliRepo } from '../posts.cli.repo';
import { NewPost } from '../posts.cli.type';

interface CommandOptions {
  amount: number;
}

@Command({
  name: 'posts:seed',
  description: 'Create record in posts table',
})
export class PostsCliSeed extends CommandRunner {
  constructor(private repo: PostsCliRepo) {
    super();
  }

  async run(_passedParams: string[], options: CommandOptions): Promise<void> {
    const data: NewPost[] = [];
    const users = await this.repo.db.users.findMany();

    for (let i = 0; i < options.amount; i++) {
      data.push({
        title: faker.book.title(),
        details: faker.lorem.lines(),
        createdBy: getRandomId(users),
        createdAt: myDayjs().toDate(),
        updatedAt: myDayjs().toDate(),
      });
    }

    await this.repo.transaction(async () => {
      this.repo.db.posts.createMany({ data });
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
