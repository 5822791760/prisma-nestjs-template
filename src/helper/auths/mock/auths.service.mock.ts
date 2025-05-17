import { AuthsService } from '../auths.service';

export class AuthsServiceMockFactory {
  static generateToken(): ReturnType<AuthsService['generateToken']> {
    return 'token';
  }
}
