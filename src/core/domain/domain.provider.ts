import { PostsRepo } from './posts/posts.repo';
import { PostsService } from './posts/posts.service';
import { UsersRepo } from './users/users.repo';
import { UsersService } from './users/users.service';

export const DOMAIN_PROVIDER = [
  // Users
  UsersService,
  UsersRepo,

  // Auths
  PostsRepo,
  PostsService,
];
