import { Command, CommandRunner } from 'nest-commander';

import { Posts } from '@core/db/entities/Posts';
import { Users } from '@core/db/entities/Users';
import { DEFAULT_PASSWORD } from '@core/shared/common/common.constant';
import { hashString } from '@core/shared/common/common.crypto';

import { InitialsCliRepo } from '../initials.cli.repo';

@Command({
  name: 'initials:seed',
  description: 'Create record in initials table',
})
export class InitialsCliSeed extends CommandRunner {
  superAdmin: Users;

  constructor(private repo: InitialsCliRepo) {
    super();
  }

  async run(_passedParams: string[]): Promise<void> {
    await this._initUsers();
    await this._initPosts();
  }

  private async _initUsers() {
    const superadmin = this.repo.from(Users).create({
      email: 'superadmin@example.com',
      password: hashString(DEFAULT_PASSWORD),
    });

    const general = this.repo.from(Users).create({
      email: 'general@example.com',
      password: hashString(DEFAULT_PASSWORD),
    });

    await this.repo.from(Users).save([superadmin, general]);

    this.superAdmin = superadmin;
  }

  private async _initPosts() {
    const posts = this.repo.from(Posts).create([
      {
        title: 'test post A',
        details: 'post A details',
        createdBy: this.superAdmin,
      },
      {
        title: 'test post B',
        details: 'post B details',
        createdBy: this.superAdmin,
      },
    ]);

    await this.repo.from(Posts).insert(posts);
  }
}
