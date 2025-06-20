import { StandardResponse } from '@core/shared/http/http.response.dto';

export class PostUsersImportCsvV1Output {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date | null;
}

export class PostUsersImportCsvV1Response extends StandardResponse {
  data: PostUsersImportCsvV1Output[];
}
