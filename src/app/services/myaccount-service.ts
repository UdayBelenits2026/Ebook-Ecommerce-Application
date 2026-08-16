import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse, UserProfile, UpdateProfileRequest } from '../interface/myaccount-interface';

@Injectable({
  providedIn: 'root',
})
export class MyaccountService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://127.0.0.1:8000';

  // GET PROFILE
  // GET /users/me

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.baseUrl}/users/me`);
  }

  // UPDATE PROFILE
  // PUT /users/me

  updateProfile(data: UpdateProfileRequest): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.baseUrl}/users/me`, data);
  }

  // UPLOAD PROFILE IMAGE
  // POST /users/me/avatar

  uploadAvatar(file: File): Observable<ApiResponse<UserProfile>> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<ApiResponse<UserProfile>>(`${this.baseUrl}/users/me/avatar`, formData);
  }
}
