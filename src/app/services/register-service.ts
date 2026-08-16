import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  RegisterRequest,
  RegisterResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse
} from '../interface/registerinterface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private baseUrl = 'https://ebook-ecommerce-backend.onrender.com';

  constructor(private http: HttpClient) {}

  // Register
  registerUser(data: RegisterRequest) {
    return this.http.post<RegisterResponse>(
      `${this.baseUrl}/auth/register`,
      data
    );
  }

  // Send OTP
  sendOtp(data: SendOtpRequest) {
    return this.http.post<SendOtpResponse>(
      `${this.baseUrl}/auth/send-otp`,
      data
    );
  }

  // Verify OTP
  verifyOtp(data: VerifyOtpRequest) {
    return this.http.post<VerifyOtpResponse>(
      `${this.baseUrl}/auth/verify-email`,
      data
    );
  }

  // Resend OTP
  resendOtp(data: ResendOtpRequest) {
    return this.http.post<ResendOtpResponse>(
      `${this.baseUrl}/auth/resend-otp`,
      data
    );
  }

}