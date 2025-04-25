import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';

export const AUTH_HEADER = 'authorization';
export const USER_CONTEXT = 'user';

export enum JwtStatus {
  Valid = 'VALID',
  Invalid = 'INVALID',
  Expired = 'EXPIRED',
}

export interface UserClaims {
  id: number;
}

export const IS_PUBLIC_KEY = 'isPublic';
export const UsePublic = () => SetMetadata(IS_PUBLIC_KEY, true);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserClaims => {
    const req = ctx.switchToHttp().getRequest();
    return req[USER_CONTEXT];
  },
);
