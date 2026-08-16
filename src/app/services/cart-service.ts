import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';

import {
  CartItem,
  CartResponse,
  CartActionResponse,
  CartCountResponse,
  AddToCartRequest,
  UpdateCartRequest,
} from '../interface/cart-interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // API

  private readonly baseUrl = 'https://ebook-ecommerce-backend.onrender.com';

  private readonly http = inject(HttpClient);

  // CART CHANGE EVENT

  readonly cartChanged = new Subject<void>();

  // NAVBAR CART COUNT

  private readonly cartCountSubject = new BehaviorSubject<number>(0);

  readonly cartCount$ = this.cartCountSubject.asObservable();

  // IMAGE NORMALIZATION

  private normalizeImage(image: string | null | undefined): string {
    if (!image || !String(image).trim()) {
      return 'assets/images/no-book.png';
    }

    const value = String(image).trim();

    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    return `${this.baseUrl}/${value.replace(/^\/+/, '')}`;
  }

  // GET CART
  // GET /cart

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}/cart`).pipe(
      map((response) => {
        const data = response?.data;

        const items: CartItem[] = Array.isArray(data?.items)
          ? data.items.map((item) => ({
              ...item,

              price: Number(item.price) || 0,

              quantity: Number(item.quantity) || 0,

              stock: Number(item.stock) || 0,

              rating: Number(item.rating) || 0,

              subtotal: Number(item.subtotal) || 0,

              image: this.normalizeImage(item.image),
            }))
          : [];

        return {
          success: response?.success ?? true,

          message: response?.message,

          data: {
            items,

            cart_count: Number(data?.cart_count) || 0,

            subtotal: Number(data?.subtotal) || 0,

            shipping: Number(data?.shipping) || 0,

            grand_total: Number(data?.grand_total) || 0,
          },
        };
      }),

      tap((response) => {
        this.cartCountSubject.next(response.data.cart_count);
      }),
    );
  }

  // ADD TO CART
  // POST /cart/add

  addToCart(payload: AddToCartRequest): Observable<CartActionResponse> {
    return this.http.post<CartActionResponse>(`${this.baseUrl}/cart/add`, payload).pipe(
      tap(() => {
        this.refreshCartCount();

        this.cartChanged.next();
      }),
    );
  }

  // INCREASE QUANTITY
  // PATCH /cart/increase/{book_id}

  increaseQuantity(bookId: number): Observable<CartActionResponse> {
    return this.http.patch<CartActionResponse>(`${this.baseUrl}/cart/increase/${bookId}`, {}).pipe(
      tap(() => {
        this.refreshCartCount();

        this.cartChanged.next();
      }),
    );
  }

  // DECREASE QUANTITY
  // PATCH /cart/decrease/{book_id}

  decreaseQuantity(bookId: number): Observable<CartActionResponse> {
    return this.http.patch<CartActionResponse>(`${this.baseUrl}/cart/decrease/${bookId}`, {}).pipe(
      tap(() => {
        this.refreshCartCount();

        this.cartChanged.next();
      }),
    );
  }

  // UPDATE QUANTITY
  // PATCH /cart/update

  updateQuantity(payload: UpdateCartRequest): Observable<CartActionResponse> {
    return this.http.patch<CartActionResponse>(`${this.baseUrl}/cart/update`, payload).pipe(
      tap(() => {
        this.refreshCartCount();

        this.cartChanged.next();
      }),
    );
  }

  // REMOVE ITEM
  // DELETE /cart/remove/{book_id}

  removeFromCart(bookId: number): Observable<CartActionResponse> {
    return this.http.delete<CartActionResponse>(`${this.baseUrl}/cart/remove/${bookId}`).pipe(
      tap(() => {
        this.refreshCartCount();

        this.cartChanged.next();
      }),
    );
  }

  // CLEAR CART
  // DELETE /cart/clear

  clearCartApi(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/clear`).pipe(
      tap(() => {
        this.cartCountSubject.next(0);

        this.cartChanged.next();
      }),
    );
  }

  // GET CART COUNT
  // GET /cart/count

  getCartCount(): Observable<CartCountResponse> {
    return this.http.get<CartCountResponse>(`${this.baseUrl}/cart/count`).pipe(
      tap((response) => {
        this.cartCountSubject.next(Number(response?.data?.cart_count) || 0);
      }),
    );
  }

  // REFRESH NAVBAR COUNT

  refreshCartCount(): void {
    this.getCartCount().subscribe({
      error: () => {
        this.cartCountSubject.next(0);
      },
    });
  }

  // RESET CART COUNT

  resetCartCount(): void {
    this.cartCountSubject.next(0);
  }
}
