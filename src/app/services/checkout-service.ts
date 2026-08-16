import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ApiResponse,
  Order,
  PlaceOrderRequest,
  PlaceOrderResponse,
} from '../interface/checkout-interface';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {

  private readonly http = inject(HttpClient);

  // BASE URLS
  private readonly orderUrl = 'https://ebook-ecommerce-backend.onrender.com/orders';

  // CASH ON DELIVERY
  // POST /orders/place
  placeOrder(
    order: PlaceOrderRequest
  ): Observable<ApiResponse<PlaceOrderResponse>> {

    return this.http.post<ApiResponse<PlaceOrderResponse>>(
      `${this.orderUrl}/place`,
      order
    );

  }

  // GET ALL ORDERS
  getOrders(): Observable<ApiResponse<Order[]>> {

    return this.http.get<ApiResponse<Order[]>>(
      this.orderUrl
    );

  }
  // GET SINGLE ORDER

  getOrderDetail(
    orderId: number
  ): Observable<ApiResponse<Order>> {

    return this.http.get<ApiResponse<Order>>(
      `${this.orderUrl}/${orderId}`
    );

  }
  // CANCEL ORDER
  cancelOrder(
    orderId: number
  ): Observable<ApiResponse<null>> {

    return this.http.delete<ApiResponse<null>>(
      `${this.orderUrl}/cancel/${orderId}`
    );

  }

}