import {
  getPaginationZod,
  zodDto,
  zodResponse,
} from '@core/shared/common/common.zod';

import {
  GetUserDetailsV1Output,
  GetUsersV1Input,
  GetUsersV1OutputData,
  PostUsersV1Input,
  PostUsersV1Output,
  PutUserDetailsV1Input,
  PutUserDetailsV1Output,
} from '../../users.v1.schema';

export class GetUsersDetailsV1HttpResponse extends zodResponse(
  GetUserDetailsV1Output,
) {}

export class GetUsersV1HttpDto extends zodDto(GetUsersV1Input) {}
export class GetUsersV1HttpResponse extends zodResponse(
  GetUsersV1OutputData,
  getPaginationZod(),
) {}

export class PostUsersV1HttpDto extends zodDto(PostUsersV1Input) {}
export class PostUsersV1HttpResponse extends zodResponse(PostUsersV1Output) {}

export class PutUserDetailsV1HttpDto extends zodDto(PutUserDetailsV1Input) {}
export class PutUserDetailsV1HttpResponse extends zodResponse(
  PutUserDetailsV1Output,
) {}
