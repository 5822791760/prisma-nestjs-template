import { get } from 'env-var';

import { AppConfig } from '@core/config';
import '@core/shared/common/common.dotenv';

export interface TestAppConfig {
  app: Pick<AppConfig['app'], 'nodeEnv' | 'port'>;
  jwt: AppConfig['jwt'];
}

export const config = (): TestAppConfig => ({
  app: {
    nodeEnv: get('NODE_ENV').default('local').asString(),
    port: get('APP_PORT').default(3000).asPortNumber(),
  },
  jwt: {
    salt: 'test',
  },
});
