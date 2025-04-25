import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CORE_CONTEXT = 'coreCtx';

export interface ICoreContext {
  traceId: string;
  requestTime: string;
}

// ===== Util =====

export const CoreContext = createParamDecorator(
  (data: unknown, context: ExecutionContext): ICoreContext => {
    return getCoreContext(context);
  },
);

export function getCoreContext(ctx: ExecutionContext): ICoreContext {
  return ctx.switchToHttp().getRequest()[CORE_CONTEXT];
}
