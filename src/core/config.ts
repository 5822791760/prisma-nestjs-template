import { get } from 'env-var';

import './shared/common/common.dotenv';

export interface AppConfig {
  app: {
    nodeEnv: string;
    port: number;
    memThreshold: number;
    enableSwagger: boolean;
    enableBullboard: boolean;
    enableJsonLog: boolean;
    enableCache: boolean;
    enableErrorDetails: boolean;
  };
  database: {
    url: string;
    enableLog: boolean;
  };
  email: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
  };
  jwt: {
    salt: string;
    noExpire: boolean;
  };
  redis: {
    url: string;
  };
  crypto: {
    aesKey: string;
  };
}

export const config = (): AppConfig => ({
  app: {
    nodeEnv: get('NODE_ENV').default('local').asString(),
    port: get('APP_PORT').default(3000).asPortNumber(),
    enableSwagger: get('ENABLE_SWAGGER').default('true').asBool(),
    enableBullboard: get('ENABLE_BULLBOARD').default('true').asBool(),
    enableJsonLog: get('ENABLE_JSON_LOG').default('true').asBool(),
    enableErrorDetails: get('ENABLE_ERROR_DETAILS').default('true').asBool(),
    enableCache: get('ENABLE_CACHE').default('false').asBool(),
    memThreshold: get('MEM_THRESHOLD')
      .default(150 * 1024 * 1024)
      .asIntPositive(),
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
  jwt: {
    salt: get('JWT_SALT').required().asString(),
    noExpire: get('JWT_NO_EXPIRE').default('false').asBool(),
  },
  redis: {
    url: get('REDIS_URL').default('redis://localhost:6379').asString(),
  },
  crypto: {
    aesKey: get('AES_KEY').required().asString(),
  },
});
