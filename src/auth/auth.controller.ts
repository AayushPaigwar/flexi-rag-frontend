
import { AuthService } from './auth.service';
import { AuthResponse, VerifyOtpResponse } from './types/auth.types';

export class AuthController {
  private readonly authService: AuthService;
  
  constructor() {
    this.authService = new AuthService();
  }

  async signInWithOtp(signInDto: { email: string }): Promise<AuthResponse> {
    try {
      return this.authService.signInWithOtp(signInDto);
    } catch (error) {
      console.error("Auth controller signInWithOtp error:", error);
      throw error;
    }
  }

  async verifyOtp(verifyOtpDto: { email: string; token: string }): Promise<VerifyOtpResponse> {
    try {
      console.log("Auth controller verifying OTP:", verifyOtpDto);
      return this.authService.verifyOtp(verifyOtpDto);
    } catch (error) {
      console.error("Auth controller verifyOtp error:", error);
      throw error;
    }
  }

  async createUser(createUserDto: { name: string; email: string; phone_number?: string }): Promise<AuthResponse> {
    try {
      return this.authService.createUser(createUserDto);
    } catch (error) {
      console.error("Auth controller createUser error:", error);
      throw error;
    }
  }
}
