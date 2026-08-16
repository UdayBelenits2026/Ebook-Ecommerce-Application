import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  OrdersResponse,
  OrderStatusUpdate,
  TrackingUpdate,
  AdminOrder,
} from '../interface/admin-orders-interface';

@Injectable({
  providedIn: 'root',
})
export class AdminOrdersService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://127.0.0.1:8000/admin/orders';

  // GET ALL ORDERS
  // GET /admin/orders

  getOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(this.apiUrl);
  }

  // GET SINGLE ORDER
  // GET /admin/orders/{id}

  getOrder(id: number): Observable<{
    success: boolean;
    message: string;
    data: AdminOrder;
  }> {
    return this.http.get<{
      success: boolean;
      message: string;
      data: AdminOrder;
    }>(`${this.apiUrl}/${id}`);
  }

  // UPDATE ORDER STATUS
  // PATCH /admin/orders/{id}/status

  updateStatus(
    id: number,
    body: OrderStatusUpdate,
  ): Observable<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    return this.http.patch<{
      success: boolean;
      message: string;
      data?: any;
    }>(`${this.apiUrl}/${id}/status`, body);
  }

  // UPDATE TRACKING DETAILS
  // PATCH /admin/orders/{id}/tracking

  updateTracking(
    id: number,
    body: TrackingUpdate,
  ): Observable<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    return this.http.patch<{
      success: boolean;
      message: string;
      data?: any;
    }>(`${this.apiUrl}/${id}/tracking`, body);
  }
}
