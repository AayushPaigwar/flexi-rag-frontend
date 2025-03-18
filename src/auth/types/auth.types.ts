export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  email_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
  verification_required?: boolean;
}

export interface VerifyOtpResponse {
  message: string;
  user: User;
}

export class ApiRequestError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
  }
}