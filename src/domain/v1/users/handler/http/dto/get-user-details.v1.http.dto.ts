import { IStandardSingleApiResponse } from '@core/shared/http/http.standard';

import { UserDetails } from '../../../users.v1.type';

// === response ===

class GetUserDetailsV1HttpData implements UserDetails {
  id: number;
  email: string;
  createdAt: Date;
}

export class GetUserDetailsV1HttpResponse
  implements IStandardSingleApiResponse
{
  success: boolean;
  key: string;
  data: GetUserDetailsV1HttpData;
}
