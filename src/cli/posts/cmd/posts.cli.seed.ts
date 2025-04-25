import { faker } from '@faker-js/faker';
import { Command, CommandRunner, Option } from 'nest-commander';

import { Posts } from '@core/db/entities/Posts';
import { Users } from '@core/db/entities/Users';
import tzDayjs from '@core/shared/common/common.dayjs';
import { getRandomId } from '@core/shared/common/common.func';

import { PostsCliRepo } from '../posts.cli.repo';

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
    const posts: Posts[] = [];
    const users = await this.repo.from(Users).find();

    for (let i = 0; i < options.amount; i++) {
      posts.push(
        this.repo.from(Posts).create({
          title: faker.book.title(),
          details: faker.lorem.lines(),
          createdBy: { id: getRandomId(users) },
          createdAt: tzDayjs().toDate(),
          updatedAt: tzDayjs().toDate(),
        }),
      );
    }

    await this.repo.transaction(async () => {
      this.repo.from(Posts).insert(posts);
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
