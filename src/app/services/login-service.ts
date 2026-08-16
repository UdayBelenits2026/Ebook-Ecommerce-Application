import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../interface/logininterface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  base_url = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  // Login

  LoginUser(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.base_url}/auth/login`, data);
  }

  // Logout

  LogoutUser() {
    return this.http.post(`${this.base_url}/auth/logout`, {});
  }

  // Forgot Password

  ForgotPass(data: ForgotPasswordRequest) {
    return this.http.post<ForgotPasswordResponse>(`${this.base_url}/auth/forgot-password`, data);
  }

  // Reset Password

  ResetPassword(data: ResetPasswordRequest) {
    return this.http.post<ResetPasswordResponse>(`${this.base_url}/auth/reset-password`, data);
  }
}
