import { get } from 'env-var';

import { AppConfig } from '@core/config';
import '@core/shared/common/common.dotenv';

export interface TestAppConfig {
  app: Pick<AppConfig['app'], 'nodeEnv' | 'port'>;
  jwt: AppConfig['jwt'];
  email: AppConfig['email'];
  redis: AppConfig['redis'];
  database: AppConfig['database'];
}

export const config = (): TestAppConfig => ({
  app: {
    nodeEnv: get('NODE_ENV').default('local').asString(),
    port: get('APP_PORT').default(3000).asPortNumber(),
  },
  jwt: {
    salt: 'test',
  },
  database: {
    url: get('DATABASE_URL').required().asString(),
    enableLog: get('ENABLE_DB_LOG').default('false').asBool(),
  },
  email: {
    host: get('EMAIL_HOST').default('localhost').asString(),
    port: get('EMAIL_PORT').default(1025).asPortNumber(),
    secure: get('EMAIL_SECURE').default('false').asBool(),
    user: get('EMAIL_USER').default('smtp').asString(),
    password: get('EMAIL_PASSWORD').default('smtp').asString(),
    from: get('EMAIL_FROM').default('app@example.com').asString(),
  },
  redis: {
    url: get('REDIS_URL').required().asString(),
  },
});
