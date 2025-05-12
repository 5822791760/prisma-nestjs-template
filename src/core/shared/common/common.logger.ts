import {
  blue,
  bold,
  cyan,
  gray,
  green,
  magenta,
  red,
  white,
  yellowBright,
} from 'chalk';
import * as ErrorStackParser from 'error-stack-parser';
import { WinstonModule, utilities } from 'nest-winston';
import { format, transports } from 'winston';

import { AppConfig } from '@core/config';

import { HttpBaseException } from '../http/http.exception';
import tzDayjs from './common.dayjs';

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

export function prettyLogError(error: Error) {
  let message = error.message;
  if (error instanceof HttpBaseException) {
    const baseException = error as HttpBaseException;
    if (baseException?.key !== 'internal') {
      // only pretty print internal error
      return;
    }
    message = baseException.key;
  }

  const timestamp = tzDayjs().format('YYYY-MM-DD HH:mm:ss Z');

  // Header for the error log
  console.log('');
  console.log(bold.red('========= ERROR LOG ========='));
  console.log(cyan(`Timestamp: ${timestamp}`));
  console.log('');

  // Error message
  console.log(red.bold('Error: ') + yellowBright(message));

  console.log('');

  // Parse and format each frame in the stack trace
  const parsedStack = ErrorStackParser.parse(error);

  parsedStack.forEach((frame, index) => {
    console.log(
      blue(`#${index + 1}`) +
        gray(` Function: `) +
        green(frame.functionName || '(anonymous function)') +
        gray(`\n    Location: `) +
        blue(`${frame.fileName}:${frame.lineNumber}:${frame.columnNumber}`) +
        gray(`\n    File: `) +
        magenta(frame.fileName) +
        gray(`\n    Line: `) +
        white(`${frame.lineNumber}:${frame.columnNumber}`),
    );
    console.log('');
  });

  // Footer
  console.log(bold.red('=============================\n'));
}
