import { zodDto, zodResponse } from '@core/shared/common/common.zod';

import {
  PostAuthsSignInsV1Input,
  PostAuthsSignInsV1Output,
} from '../../schema/post-auths-sign-ins.v1';
import {
  PostAuthsSignUpsV1Input,
  PostAuthsSignUpsV1Output,
} from '../../schema/post-auths-sign-ups.v1';

export class PostAuthsSignInsV1HttpDto extends zodDto(
  PostAuthsSignInsV1Input,
) {}
export class PostAuthsSignInsV1HttpResponse extends zodResponse(
  PostAuthsSignInsV1Output,
) {}

//
export class PostAuthsSignUpsV1HttpDto extends zodDto(
  PostAuthsSignUpsV1Input,
) {}
export class PostAuthsSignUpsHttpResponse extends zodResponse(
  PostAuthsSignUpsV1Output,
) {}
