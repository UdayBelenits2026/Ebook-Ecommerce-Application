import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ApiResponse,
  ChangePasswordRequest
} from '../interface/settings-interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://ebook-ecommerce-backend.onrender.com';

  changePassword(
    data: ChangePasswordRequest
  ): Observable<ApiResponse> {

    return this.http.put<ApiResponse>(
      `${this.baseUrl}/customer/change-password`,
      data
    );

  }

}