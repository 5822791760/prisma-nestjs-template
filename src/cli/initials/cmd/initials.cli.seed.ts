import { Command, CommandRunner } from 'nest-commander';

import { Users } from '@core/db/prisma';
import { PostsRepo } from '@core/domain/posts/posts.repo';
import { PostsService } from '@core/domain/posts/posts.service';
import { UsersRepo } from '@core/domain/users/users.repo';
import { UsersService } from '@core/domain/users/users.service';
import { DEFAULT_PASSWORD } from '@core/shared/common/common.constant';

import { InitialsCliRepo } from '../initials.cli.repo';

@Command({
  name: 'initials:seed',
  description: 'Create record in initials table',
})
export class InitialsCliSeed extends CommandRunner {
  superAdmin: Users;

  constructor(
    private repo: InitialsCliRepo,
    private usersRepo: UsersRepo,
    private usersService: UsersService,
    private postsRepo: PostsRepo,
    private postsService: PostsService,
  ) {
    super();
  }

  async run(_passedParams: string[]): Promise<void> {
    await this.repo.transaction(async () => {
      await this._initUsers();
      await this._initPosts();
    });
  }

  private async _initUsers() {
    const superadminData = this.usersService.new({
      email: 'superadmin@example.com',
      password: DEFAULT_PASSWORD,
    });
    const superadmin = await this.usersRepo.create(superadminData);

    const general = this.usersService.new({
      email: 'general@example.com',
      password: DEFAULT_PASSWORD,
    });
    await this.usersRepo.create(general);

    this.superAdmin = superadmin;
  }

  private async _initPosts() {
    await this.postsRepo.createMany([
      this.postsService.new({
        title: 'test post A',
        details: 'post A details',
        createdBy: this.superAdmin.id,
      }),
      this.postsService.new({
        title: 'test post B',
        details: 'post B details',
        createdBy: this.superAdmin.id,
      }),
    ]);
  }
}
