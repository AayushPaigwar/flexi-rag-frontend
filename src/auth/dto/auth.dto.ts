
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import 'reflect-metadata';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  token!: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  phone_number?: string;
}
