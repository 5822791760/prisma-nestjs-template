import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UAParser } from 'ua-parser-js';

import { generateUID } from '@core/shared/common/common.crypto';
import myDayjs from '@core/shared/common/common.dayjs';

import { CORE_CONTEXT, ICoreContext } from './core-context.common';

@Injectable()
export class CoreContextInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const uaData = UAParser(request.headers['user-agent']);

    const coreCtx: ICoreContext = {
      traceId: generateUID(),
      requestTime: myDayjs().toISOString(),
      agent: uaData.ua,
      device: uaData.device,
      os: uaData.os?.name || '',
      ip: request.ip || request.connection?.remoteAddress || '',
      browser: uaData.browser?.name || '',
    };

    request[CORE_CONTEXT] = coreCtx;

    return next.handle();
  }
}
