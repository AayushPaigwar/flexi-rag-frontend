
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

export class AuthModule {
  static getController(): AuthController {
    return new AuthController();
  }

  static getService(): AuthService {
    return new AuthService();
  }
}
