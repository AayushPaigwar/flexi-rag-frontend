
export interface AuthResponse {
  message: string;
  user?: any;
  verification_required?: boolean;
}

export interface VerifyOtpResponse {
  message: string;
  user: any;
}
