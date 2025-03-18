
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, VerifyOtpDto } from './dto/auth.dto';
import { AuthResponse, VerifyOtpResponse } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signInWithOtp(@Body() signInDto: SignInDto): Promise<AuthResponse> {
    return this.authService.signInWithOtp(signInDto);
  }

  @Post('verify')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<VerifyOtpResponse> {
    return this.authService.verifyOtp(verifyOtpDto);
  }
}
