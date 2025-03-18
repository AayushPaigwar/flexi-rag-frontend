import 'reflect-metadata'; // Ensure this is imported

export class SignInDto {
  // @IsEmail()
  // @IsNotEmpty()
  email!: string; // Add definite assignment assertion
}

export class VerifyOtpDto {
  // @IsEmail()
  // @IsNotEmpty()
  email!: string; // Add definite assignment assertion

  // @IsString()
  // @IsNotEmpty()
  token!: string; // Add definite assignment assertion
}