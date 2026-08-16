// Login

export interface LoginRequest {
  email: string;

  password: string;
}

export interface LoginData {
  access_token: string;

  token_type: string;

  role: 'admin' | 'customer';

  id: number;

  full_name: string;

  email: string;
}

export interface LoginResponse {
  success: boolean;

  message: string;

  data: LoginData;
}

// Forgot Password

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;

  message: string;
}

// Reset Password

export interface ResetPasswordRequest {
  email: string;

  otp: string;

  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;

  message: string;
}
