import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SignInDto, VerifyOtpDto } from './dto/auth.dto';
import { AuthResponse, VerifyOtpResponse } from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api/v1'; // Adjust this URL based on your backend configuration

  /**
   * Signs in a user by sending an OTP to their email
   * @param signInDto DTO containing the user's email
   * @returns AuthResponse with success message
   */
  async signInWithOtp(signInDto: SignInDto): Promise<AuthResponse> {
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
        throw new BadRequestException(data.message || 'Failed to send OTP');
      }

      return { 
        message: data.message || 'OTP sent to email. Please check your inbox.'
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to send OTP. Please try again later.');
    }
  }

  /**
   * Verifies the OTP for user authentication
   * @param verifyOtpDto DTO containing email and OTP token
   * @returns VerifyOtpResponse with user data and success message
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<VerifyOtpResponse> {
    try {
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

      const data = await response.json();

      if (!response.ok) {
        throw new BadRequestException(data.message || 'Failed to verify OTP');
      }

      return {
        message: data.message || 'Email verified successfully',
        user: data.user,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to verify OTP. Please try again later.');
    }
  }

  /**
   * Creates a new user and initiates OTP verification
   * @param signInDto DTO containing user details
   * @returns AuthResponse with user data and verification message
   */
  async createUser(signInDto: { name: string; email: string; phone_number?: string }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signInDto.name,
          email: signInDto.email,
          phone_number: signInDto.phone_number,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new BadRequestException(data.message || 'Failed to create user');
      }

      return {
        message: data.message || 'Please check your email for OTP verification',
        user: data,
        verification_required: data.verification_required || true,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user. Please try again later.');
    }
  }
}