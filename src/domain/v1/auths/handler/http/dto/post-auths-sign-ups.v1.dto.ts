import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { IStandardSingleApiResponse } from '@core/shared/http/http.standard';

import { AuthDetails, NewUserData } from '@domain/v1/auths/auths.v1.type';

// ====== body =======

export class PostAuthsSignUpsV1HttpDto implements NewUserData {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;
}

// ===== response =====

class PostAuthsSignUpsV1HttpData implements AuthDetails {
  token: string;
  lastSignedInAt: Date;
}

export class PostAuthsSignUpsHttpResponse
  implements IStandardSingleApiResponse
{
  success: boolean;
  key: string;
  data: PostAuthsSignUpsV1HttpData;
}
