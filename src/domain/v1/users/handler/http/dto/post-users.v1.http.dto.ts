import { IsEmail, IsString } from 'class-validator';

import { IStandardSingleApiResponse } from '@core/shared/http/http.standard';

import { NewUserData } from '../../../users.v1.type';

// ===== body =====

export class PostUsersV1HttpDto implements NewUserData {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

// ===== response =====

class PostUsersV1HttpData {}

export class PostUsersV1HttpResponse implements IStandardSingleApiResponse {
  success: boolean;
  key: string;
  data: PostUsersV1HttpData;
}
