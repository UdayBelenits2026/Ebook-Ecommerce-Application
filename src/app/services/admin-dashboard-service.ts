import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardApiResponse,DashboardStatistics } from '../interface/admin-dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  // Change this according to your backend URL
  private readonly baseUrl = 'http://127.0.0.1:8000';

  constructor() {}

  /**
   * Get Dashboard Statistics
   * GET /admin/dashboard
   */
  getDashboardStatistics(): Observable<DashboardApiResponse<DashboardStatistics>> {

    return this.http.get<DashboardApiResponse<DashboardStatistics>>(
      `${this.baseUrl}/admin/dashboard`
    ).pipe(
      catchError(this.handleError)
    );

  }

  /**
   * Update Order Status
   * PATCH /admin/orders/{id}/status
   */
  updateOrderStatus(
    orderId: number,
    status: string
  ): Observable<DashboardApiResponse<null>> {

    return this.http.patch<DashboardApiResponse<null>>(
      `${this.baseUrl}/admin/orders/${orderId}/status`,
      {
        status
      }
    ).pipe(
      catchError(this.handleError)
    );

  }

  /**
   * Update User Status
   * PATCH /admin/users/{id}/status
   */
  updateUserStatus(
    userId: number,
    status: string
  ): Observable<DashboardApiResponse<null>> {

    return this.http.patch<DashboardApiResponse<null>>(
      `${this.baseUrl}/admin/users/${userId}/status`,
      {
        status
      }
    ).pipe(
      catchError(this.handleError)
    );

  }

  /*
   Common Error Handler
   */
  private handleError(error: HttpErrorResponse) {

    let message = 'Something went wrong.';

    if (error.error?.message) {
      message = error.error.message;
    }

    return throwError(() => new Error(message));

  }

}