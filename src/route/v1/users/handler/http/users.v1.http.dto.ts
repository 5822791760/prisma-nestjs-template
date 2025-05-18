import {
  getPaginationZod,
  zodDto,
  zodResponse,
} from '@core/shared/common/common.zod';

import { GetUsersIdV1Output } from '../../schema/get-users-id.v1';
import {
  GetUsersV1Input,
  GetUsersV1OutputData,
} from '../../schema/get-users.v1';
import {
  PostUsersV1Input,
  PostUsersV1Output,
} from '../../schema/post-users.v1';
import {
  PutUsersIdV1Input,
  PutUsersIdV1Output,
} from '../../schema/put-users-id.v1';

//

export class GetUsersIdV1HttpResponse extends zodResponse(GetUsersIdV1Output) {}

//

export class GetUsersV1HttpDto extends zodDto(GetUsersV1Input) {}
export class GetUsersV1Response extends zodResponse(
  GetUsersV1OutputData,
  getPaginationZod(),
) {}

//

export class PostUsersV1HttpDto extends zodDto(PostUsersV1Input) {}
export class PostUsersV1Response extends zodResponse(PostUsersV1Output) {}

//

export class PutUsersIdV1HttpDto extends zodDto(PutUsersIdV1Input) {}
export class PutUsersIdV1Response extends zodResponse(PutUsersIdV1Output) {}
