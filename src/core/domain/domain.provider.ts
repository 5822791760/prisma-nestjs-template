import { AuthsModule } from './auths/auths.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

export const DOMAIN_PROVIDER = [
  //
  UsersModule,
  AuthsModule,
  PostsModule,
];
