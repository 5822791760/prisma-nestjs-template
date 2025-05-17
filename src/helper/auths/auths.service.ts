import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '@core/config';
import { encodeUserJwt } from '@core/shared/common/common.crypto';
import { Read } from '@core/shared/common/common.type';

import { TokenInput } from './auths.type';

@Injectable()
export class AuthsService {
  constructor(private readonly configService: ConfigService) {}

  generateToken(user: Read<TokenInput>): string {
    const jwtConfig = this.configService.getOrThrow<AppConfig['jwt']>('jwt');
    return encodeUserJwt({ id: user.id }, jwtConfig.salt);
  }
}
