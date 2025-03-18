
export class SignInDto {
  email!: string;
}

export class VerifyOtpDto {
  email!: string;
  token!: string;
}

export class CreateUserDto {
  name!: string;
  email!: string;
  phone_number?: string;
}
