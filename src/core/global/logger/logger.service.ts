import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '@core/config';
import { ICoreContext } from '@core/middleware/core-context/core-context.common';
import { prettyLogError } from '@core/shared/common/common.logger';

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
      prettyLogError(exception);
    }
  }
}
