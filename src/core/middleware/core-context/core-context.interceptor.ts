import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { generateUID } from '@core/shared/common/common.crypto';
import myDayjs from '@core/shared/common/common.dayjs';

import { CORE_CONTEXT, ICoreContext } from './core-context.common';

@Injectable()
export class CoreContextInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const coreCtx: ICoreContext = {
      traceId: generateUID(),
      requestTime: myDayjs().toISOString(),
    };
    request[CORE_CONTEXT] = coreCtx;

    return next.handle();
  }
}
