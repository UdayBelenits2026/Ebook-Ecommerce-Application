export interface RegisterRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
}