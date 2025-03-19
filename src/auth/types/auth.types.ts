export interface AuthResponse {
  message: string;
  is_new_user?: boolean;
  user?: any;
  verification_required?: boolean;
}

export interface VerifyOtpResponse {
  message: string;
  user: any;
}
