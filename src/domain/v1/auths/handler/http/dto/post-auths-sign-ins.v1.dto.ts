import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IStandardSingleApiResponse } from '@core/shared/http/http.standard';

import { AuthDetails, SignInUserData } from '@domain/v1/auths/auths.v1.type';

// ====== body =======

export class PostAuthsSignInsV1HttpDto implements SignInUserData {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// ===== response =====

class PostAuthsSignInsV1HttpData implements AuthDetails {
  token: string;
  lastSignedInAt: Date;
}

export class PostAuthsSignInsV1HttpResponse
  implements IStandardSingleApiResponse
{
  success: boolean;
  key: string;
  data: PostAuthsSignInsV1HttpData;
}
