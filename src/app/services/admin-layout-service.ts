import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  ApiResponse,
  AdminProfile,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  UploadProfileImageResponse,
  LogoutResponse,
} from '../interface/admin-layout-interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://ebook-ecommerce-backend.onrender.com/admin';

  constructor() {}

  getProfile(): Observable<ApiResponse<AdminProfile>> {
    // Normalize profile_image to an absolute URL so layouts/components can render it directly
    const apiRoot = this.baseUrl.replace(/\/admin$/i, '');

    return this.http.get<ApiResponse<AdminProfile>>(`${this.baseUrl}/profile`).pipe(
      // transform response to ensure profile_image is a full URL with cache-busting
      map((res: ApiResponse<AdminProfile>) => {
        if (res && res.data && res.data.profile_image) {
          const img = res.data.profile_image;
          if (!img.startsWith('http')) {
            res.data.profile_image = apiRoot + img + '?t=' + Date.now();
          } else {
            // preserve existing absolute URLs and add cache-bust
            res.data.profile_image = img + '?t=' + Date.now();
          }
        }
        return res as ApiResponse<AdminProfile>;
      }),
      catchError(this.handleError),
    );
  }

  /**
   
   * UPDATE ADMIN PROFILE
   * PUT /admin/profile
   
   */
  updateProfile(request: UpdateProfileRequest): Observable<ApiResponse<UpdateProfileResponse>> {
    return this.http
      .put<ApiResponse<UpdateProfileResponse>>(`${this.baseUrl}/profile`, request)
      .pipe(catchError(this.handleError));
  }

  /*
   * CHANGE PASSWORD
   * PUT /admin/change-password
   */
  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<null>> {
    return this.http
      .put<ApiResponse<null>>(`${this.baseUrl}/change-password`, request)
      .pipe(catchError(this.handleError));
  }

  /**
  
   * UPLOAD PROFILE IMAGE
   * POST /admin/profile/upload-image
   */
  uploadProfileImage(file: File): Observable<ApiResponse<UploadProfileImageResponse>> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http
      .post<ApiResponse<UploadProfileImageResponse>>(
        `${this.baseUrl}/profile/upload-image`,
        formData,
      )
      .pipe(catchError(this.handleError));
  }

  /**
   
   * LOGOUT
   * POST /admin/logout
   
   */
  logout(): Observable<LogoutResponse> {
    return this.http
      .post<LogoutResponse>(`${this.baseUrl}/logout`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   
   * COMMON ERROR HANDLER
   
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('Admin Service Error:', error);

    return throwError(() => new Error(errorMessage));
  }
}
