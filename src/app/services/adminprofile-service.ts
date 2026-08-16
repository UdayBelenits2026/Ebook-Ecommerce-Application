import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import {

  AdminProfile,

  AdminProfileUpdate,

  ChangePassword,

  ApiResponse

} from '../interface/admin-profile-interface';

@Injectable({
  providedIn: 'root'
})

export class AdminProfileService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://ebook-ecommerce-backend.onrender.com/admin';

  getProfile(): Observable<ApiResponse<AdminProfile>> {

    return this.http.get<ApiResponse<AdminProfile>>(
      `${this.apiUrl}/profile`
    );

  }

  updateProfile(

    body: AdminProfileUpdate

  ): Observable<ApiResponse<AdminProfile>> {

    return this.http.put<ApiResponse<AdminProfile>>(
      `${this.apiUrl}/profile`,
      body
    );

  }

  changePassword(

    body: ChangePassword

  ): Observable<ApiResponse<any>> {

    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/change-password`,
      body
    );

  }

  uploadImage(

    file: File

  ): Observable<ApiResponse<any>> {

    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/profile/upload-image`,
      formData
    );

  }

}