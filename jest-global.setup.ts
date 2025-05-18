import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';
import 'tsconfig-paths/register';

export default async () => {
  const pgContainer = await new PostgreSqlContainer().start();
  const redisContainer = await new RedisContainer('redis:7.2').start();

  process.env.DATABASE_URL = pgContainer.getConnectionUri();
  process.env.REDIS_URL = redisContainer.getConnectionUrl();

  globalThis.pgContainer = pgContainer;
  globalThis.redisContainer = redisContainer;
};
