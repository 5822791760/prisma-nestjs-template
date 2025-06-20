import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '@core/config';

export const S3_STORAGE = Symbol('S3_STORAGE');

export const StorageProvider: Provider = {
  provide: S3_STORAGE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const storageConfig =
      configService.getOrThrow<AppConfig['storage']>('storage');

    if (!storageConfig.enable) {
      return null;
    }

    const s3 = new S3Client({
      region: storageConfig.region,
      endpoint: storageConfig.endpoint ? 'http://localhost:9000' : undefined,
      forcePathStyle: storageConfig.enableforcePath,
      credentials: {
        accessKeyId: storageConfig.accessKey!,
        secretAccessKey: storageConfig.secretKey!,
      },
    });

    return s3;
  },
};
