import { get } from 'env-var';

import { AppConfig } from '@core/config';
import '@core/shared/common/common.dotenv';

export interface TestAppConfig {
  app: AppConfig['app'];
  jwt: AppConfig['jwt'];
}

export const config = (): TestAppConfig => ({
  app: {
    nodeEnv: get('NODE_ENV').default('local').asString(),
    port: get('APP_PORT').default(3000).asPortNumber(),
    enableSwagger: get('ENABLE_SWAGGER').default('false').asBool(),
    enableBullboard: get('ENABLE_BULLBOARD').default('false').asBool(),
    enableJsonLog: get('ENABLE_JSON_LOG').default('false').asBool(),
    enableCache: get('ENABLE_CACHE').default('false').asBool(),
    memThreshold: get('MEM_THRESHOLD')
      .default(150 * 1024 * 1024)
      .asIntPositive(),
  },
  jwt: {
    salt: 'test',
  },
});
