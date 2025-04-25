import { WinstonModule, utilities } from 'nest-winston';
import { format, transports } from 'winston';

import { AppConfig } from '@core/config';

export function coreLogger(appConfig: AppConfig['app']) {
  return WinstonModule.createLogger({
    transports: [
      new transports.Console({
        format: appConfig.enableJsonLog
          ? format.combine(
              format.timestamp(),
              format.json(), // Use JSON format for Promtail
            )
          : format.combine(
              utilities.format.nestLike('BE', {
                colors: true,
                prettyPrint: true,
              }),
            ),
      }),
    ],
  });
}
