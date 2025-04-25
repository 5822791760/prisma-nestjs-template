import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

import { AppConfig } from '@core/config';
import { ICoreContext } from '@core/middleware/core-context/core-context.common';
import tzDayjs from '@core/shared/common/common.dayjs';
import { HttpBaseException } from '@core/shared/http/http.exception';

import { TraceLog } from './logger.type';

@Injectable()
export class LoggerService {
  private _enableJsonLog: boolean;

  private readonly _traceLogger = new Logger('trace');
  private readonly _exceptionLogger = new Logger('exception');

  constructor(private configService: ConfigService) {
    const appConfig = this.configService.getOrThrow<AppConfig['app']>('app');
    this._enableJsonLog = appConfig?.enableJsonLog;
  }

  trace(ctx: ICoreContext, message: string, data?: any) {
    const traceLog: TraceLog = {
      message,
      traceId: ctx.traceId,
      requestTime: ctx.requestTime,
      data,
    };

    this._traceLogger.log(traceLog);
  }

  error(exception: Error) {
    if (!this._enableJsonLog) {
      this._prettyLogError(exception);
    }
  }

  private _prettyLogError(error: Error) {
    if (error instanceof NotFoundException) {
      // Bug in bullboard sometimes send not found api
      // i will ignore
      return;
    }

    const timestamp = tzDayjs().format('YYYY-MM-DD HH:mm:ss Z');

    let message = error.message;
    if (error instanceof HttpBaseException) {
      const baseException = error as HttpBaseException;
      message = baseException.key;
    }

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
}
