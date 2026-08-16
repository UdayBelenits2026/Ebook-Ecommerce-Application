import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {ApiResponse,MyOrder,
  OrderDetail,} from '../interface/myorders-interface'

@Injectable({
  providedIn: 'root',
})
export class MyordersService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://127.0.0.1:8000/orders';

  /**
   * Get all orders of logged-in customer
   */
  getOrders(): Observable<ApiResponse<MyOrder[]>> {

    return this.http.get<ApiResponse<MyOrder[]>>(
      this.baseUrl
    );

  }

  /**
   * Get single order details
   */
  getOrder(orderId: number): Observable<ApiResponse<OrderDetail>> {

    return this.http.get<ApiResponse<OrderDetail>>(
      `${this.baseUrl}/${orderId}`
    );

  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: number): Observable<ApiResponse<any>> {

    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/cancel/${orderId}`
    );

  }

}