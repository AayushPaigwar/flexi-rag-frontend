
import { AuthService } from './auth.service';
import { AuthResponse, VerifyOtpResponse } from './types/auth.types';

export class AuthController {
  private readonly authService: AuthService;
  
  constructor() {
    this.authService = new AuthService();
  }

  async signInWithOtp(signInDto: { email: string }): Promise<AuthResponse> {
    return this.authService.signInWithOtp(signInDto);
  }

  async verifyOtp(verifyOtpDto: { email: string; token: string }): Promise<VerifyOtpResponse> {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  async createUser(createUserDto: { name: string; email: string; phone_number?: string }): Promise<AuthResponse> {
    return this.authService.createUser(createUserDto);
  }
}
