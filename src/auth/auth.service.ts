
import { AuthResponse, VerifyOtpResponse } from './types/auth.types';

export class AuthService {

  // TODO: chnage the API URL to the correct one
  private readonly API_URL = 'https://flexirag-cqdrbdcvc0gfhxbg.canadacentral-01.azurewebsites.net//api/v1';
  // private readonly API_URL = 'http://localhost:8000/api/v1';

  /**
   * Signs in a user by sending an OTP to their email
   * @param signInDto DTO containing the user's email
   * @returns AuthResponse with success message
   */
  async signInWithOtp(signInDto: { email: string }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/users/signin-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: signInDto.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.detail || 'Failed to send OTP');
      }

      return { 
        message: data.message || 'OTP sent to email. Please check your inbox.'
      };
    } catch (error) {
      console.error("Auth service signInWithOtp error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to send OTP. Please try again later.');
    }
  }

  /**
   * Verifies the OTP for user authentication
   * @param verifyOtpDto DTO containing email and OTP token
   * @returns VerifyOtpResponse with user data and success message
   */
  async verifyOtp(verifyOtpDto: { email: string; token: string }): Promise<VerifyOtpResponse> {
    try {
      console.log("Auth service verifying OTP:", verifyOtpDto);
      const response = await fetch(`${this.API_URL}/users/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verifyOtpDto.email,
          token: verifyOtpDto.token,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.detail || `Failed to verify OTP: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        message: data.message || 'Email verified successfully',
        user: data.user,
      };
    } catch (error) {
      console.error("Auth service verifyOtp error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to verify OTP. Please try again later.');
    }
  }

  /**
   * Creates a new user and initiates OTP verification
   * @param createUserDto DTO containing user details
   * @returns AuthResponse with user data and verification message
   */
  async createUser(createUserDto: { name: string; email: string; phone_number?: string }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createUserDto.name,
          email: createUserDto.email,
          phone_number: createUserDto.phone_number,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.detail || 'Failed to create user');
      }

      return {
        message: data.message || 'Please check your email for OTP verification',
        user: data,
        verification_required: data.verification_required || true,
      };
    } catch (error) {
      console.error("Auth service createUser error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create user. Please try again later.');
    }
  }
}
