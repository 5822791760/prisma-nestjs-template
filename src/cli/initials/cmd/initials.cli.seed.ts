import { Command, CommandRunner } from 'nest-commander';

import { Users } from '@core/db/prisma';
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
    const superadmin = await this.repo.db.users.create({
      data: {
        email: 'superadmin@example.com',
        password: hashString(DEFAULT_PASSWORD),
      },
    });

    await this.repo.db.users.create({
      data: {
        email: 'general@example.com',
        password: hashString(DEFAULT_PASSWORD),
      },
    });

    this.superAdmin = superadmin;
  }

  private async _initPosts() {
    await this.repo.db.posts.createMany({
      data: [
        {
          title: 'test post A',
          details: 'post A details',
          createdBy: this.superAdmin.id,
        },
        {
          title: 'test post B',
          details: 'post B details',
          createdBy: this.superAdmin.id,
        },
      ],
    });
  }
}
