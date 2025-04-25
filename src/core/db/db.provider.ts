import { Provider } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

import { config } from '@core/config';

const dbConfig = config().database;

export const connectionSource = new DataSource({
  type: 'postgres',
  url: dbConfig.url,
  synchronize: false,
  entities: [__dirname + '/entities/*.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  migrationsRun: dbConfig.enableAutoMigrate,
  logging: dbConfig.enableLog,
} as DataSourceOptions);

export const DataSourceProvider: Provider = {
  provide: DataSource,
  useFactory: async () => {
    await connectionSource.initialize();
    return connectionSource;
  },
};
