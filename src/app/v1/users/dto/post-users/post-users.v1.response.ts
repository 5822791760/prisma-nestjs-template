import { UserResponseData } from '@core/domain/users/users.response';
import { StandardResponse } from '@core/shared/http/http.response.dto';

export class PostUsersV1Output extends UserResponseData {}

export class PostUsersV1Response extends StandardResponse {
  data: PostUsersV1Output;
}
