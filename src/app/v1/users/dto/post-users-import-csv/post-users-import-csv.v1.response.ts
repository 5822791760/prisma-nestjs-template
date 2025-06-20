import { UserResponseData } from '@core/domain/users/users.response';
import { StandardResponse } from '@core/shared/http/http.response.dto';

export class PostUsersImportCsvV1Output extends UserResponseData {}

export class PostUsersImportCsvV1Response extends StandardResponse {
  data: PostUsersImportCsvV1Output[];
}
