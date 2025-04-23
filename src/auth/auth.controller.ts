
import { AuthService } from './auth.service';
import { AuthResponse, VerifyOtpResponse } from './types/auth.types';

export class AuthController {
  private readonly authService: AuthService;
  
  constructor() {
    this.authService = new AuthService();
  }

  async signInWithEmail(email: string, password: string) {
    try {
      return this.authService.signInWithEmail(email, password);
    } catch (error) {
      console.error("Auth controller signInWithEmail error:", error);
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string) {
    try {
      return this.authService.signUpWithEmail(email, password);
    } catch (error) {
      console.error("Auth controller signUpWithEmail error:", error);
      throw error;
    }
  }

  async signOut() {
    try {
      return this.authService.signOut();
    } catch (error) {
      console.error("Auth controller signOut error:", error);
      throw error;
    }
  }

  async signInWithOtp(signInDto: { email: string }): Promise<AuthResponse> {
    try {
      return this.authService.signInWithOtp(signInDto);
    } catch (error) {
      console.error("Auth controller signInWithOtp error:", error);
      throw error;
    }
  }

  async verifyOtp(verifyOtpDto: { email: string; token: string; name?: string; phone_number?: string }): Promise<VerifyOtpResponse> {
    try {
      return this.authService.verifyOtp(verifyOtpDto);
    } catch (error) {
      console.error("Auth controller verifyOtp error:", error);
      throw error;
    }
  }
}

//   async createUser(createUserDto: { name: string; email: string; phone_number?: string }): Promise<AuthResponse> {
//     try {
//       return this.authService.createUser(createUserDto);
//     } catch (error) {
//       console.error("Auth controller createUser error:", error);
//       throw error;
//     }
//   }
// }
