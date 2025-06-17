import { UserResponseData } from '@core/domain/users/users.response';
import { StandardResponse } from '@core/shared/http/http.response.dto';

export class PutUsersIdV1Output extends UserResponseData {}

export class PutUsersIdV1Response extends StandardResponse {
  data: PutUsersIdV1Output;
}
