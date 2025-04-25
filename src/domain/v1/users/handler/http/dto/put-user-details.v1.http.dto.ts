import { IsString } from 'class-validator';

import { IStandardSingleApiResponse } from '@core/shared/http/http.standard';

import { NewUserData } from '../../../users.v1.type';

// ===== body =====

export class PutUserDetailsV1HttpDto implements NewUserData {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

// ===== response =====

class PutUserDetailsV1HttpData {}

export class PutUserDetailsV1HttpResponse
  implements IStandardSingleApiResponse
{
  success: boolean;
  key: string;
  data: PutUserDetailsV1HttpData;
}
