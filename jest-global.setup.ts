import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';
// import { GenericContainer } from 'testcontainers';
import 'tsconfig-paths/register';

export default async () => {
  const pgContainer = await new PostgreSqlContainer().start();
  const redisContainer = await new RedisContainer('redis:7.2').start();
  // const mailhogContainer = await new GenericContainer(
  //   'mailhog/mailhog',
  // ).start();

  process.env.DATABASE_URL = pgContainer.getConnectionUri();
  process.env.REDIS_URL = redisContainer.getConnectionUrl();
  // process.env.EMAIL_HOST = mailhogContainer.getHost();

  globalThis.pgContainer = pgContainer;
  globalThis.redisContainer = redisContainer;

  globalThis.requireDbSetup = true;
};
