import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UAParser } from 'ua-parser-js';

import { LangService } from '@core/global/lang/lang.service';
import { Locales } from '@core/i18n/i18n-types';
import { generateUID } from '@core/shared/common/common.crypto';
import myDayjs from '@core/shared/common/common.dayjs';
import { LANG_HEADER } from '@core/shared/http/http.headers';

import { CORE_CONTEXT, ICoreContext } from './core-context.common';

@Injectable()
export class CoreContextInterceptor implements NestInterceptor {
  constructor(private langService: LangService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();
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

    // set language
    this.langService.setLang(request.headers[LANG_HEADER] as Locales);

    return next.handle();
  }
}
