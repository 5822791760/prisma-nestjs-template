import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { AppConfig } from '@core/config';
import { LoggerService } from '@core/global/logger/logger.service';

import { isProd } from '../../shared/common/common.func';
import { HttpBaseException } from '../../shared/http/http.exception';
import { IStandardSingleApiResponse } from '../../shared/http/http.standard';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private configService: ConfigService,
    private loggerService: LoggerService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();
    const appConfig = this.configService.getOrThrow<AppConfig['app']>('app');

    const { method, path, query, body } = request;

    let status = exception.getStatus?.() || 500;
    let key = 'internal';
    let context: Record<string, any> = {};
    let fields = {};

    this.loggerService.error(exception);

    // const userAgent = request.get('user-agent') || '';

    if (exception instanceof HttpBaseException) {
      const baseException: HttpBaseException = exception;

      context = baseException.getContext();
      fields = baseException.getFields();
      status = baseException.httpStatus;
      key = baseException.key;

      if (isProd(appConfig.nodeEnv)) {
        // Not exposing prod files
        delete context['stack'];
      }
    }

    const resp: IStandardSingleApiResponse = {
      success: false,
      key,
      data: undefined,
      error: {
        fields,
        context,
        details: isProd(appConfig.nodeEnv)
          ? null
          : {
              method,
              query,
              body,
              path,
              cause: exception.cause,
              stack: exception.stack,
            },
      },
      meta: {},
    };

    response.status(status).json(resp);
  }
}
