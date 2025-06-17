import { UserResponseData } from '@core/domain/users/users.response';
import { StandardResponse } from '@core/shared/http/http.response.dto';

export class GetUsersIdV1Output extends UserResponseData {}

export class GetUsersIdV1Response extends StandardResponse {
  data: GetUsersIdV1Output;
}
