import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';

import { WishlistItem, WishlistResponse } from '../interface/wishlist-interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  // API

  private readonly baseUrl = 'http://127.0.0.1:8000';

  private readonly http = inject(HttpClient);

  // WISHLIST CHANGE EVENT

  readonly wishlistChanged = new Subject<void>();

  // WISHLIST COUNT

  private readonly wishlistCountSubject = new BehaviorSubject<number>(0);

  readonly wishlistCount$ = this.wishlistCountSubject.asObservable();

  // GET WISHLIST
  // GET /wishlist

  getWishlist(): Observable<WishlistResponse> {
    return this.http.get<any>(`${this.baseUrl}/wishlist`).pipe(
      map((response): WishlistResponse => {
        let items: WishlistItem[] = [];

        let total = 0;

        let wishlist_count = 0;

        // -----------------------------------------------
        // Backend wrapped response
        // -----------------------------------------------

        if (response?.data) {
          items = Array.isArray(response.data.items) ? response.data.items : [];

          total = Number(response.data.total ?? items.length);

          wishlist_count = Number(response.data.wishlist_count ?? items.length);
        }

        // -----------------------------------------------
        // Fallback unwrapped response
        // -----------------------------------------------
        else if (Array.isArray(response?.items)) {
          items = response.items;

          total = Number(response.total ?? items.length);

          wishlist_count = Number(response.wishlist_count ?? items.length);
        }

        // -----------------------------------------------
        // Normalize items
        // -----------------------------------------------

        items = items.map((item: WishlistItem) => ({
          ...item,

          image:
            item.image && String(item.image).trim() !== ''
              ? String(item.image).startsWith('http')
                ? String(item.image)
                : `${this.baseUrl}/${String(item.image).replace(/^\/+/, '')}`
              : 'assets/images/no-book.png',

          quantity: Number(item.quantity ?? 1),

          stock: Number(item.stock ?? 0),

          rating: Number(item.rating ?? 0),

          in_cart: Boolean(item.in_cart),
        }));

        return {
          success: response?.success ?? true,

          message: response?.message ?? 'Wishlist retrieved successfully',

          data: {
            items,

            total,

            wishlist_count,
          },
        };
      }),

      tap((response) => {
        this.wishlistCountSubject.next(response.data.wishlist_count);
      }),
    );
  }

  // ADD TO WISHLIST
  // POST /wishlist/add/{book_id}

  addToWishlist(bookId: number): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/wishlist/add/${bookId}`,

        {},
      )
      .pipe(
        tap(() => {
          this.refreshWishlistCount();

          this.wishlistChanged.next();
        }),
      );
  }

  // REMOVE FROM WISHLIST
  // DELETE /wishlist/remove/{book_id}

  removeFromWishlist(bookId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/wishlist/remove/${bookId}`).pipe(
      tap(() => {
        this.refreshWishlistCount();

        this.wishlistChanged.next();
      }),
    );
  }

  // MOVE WISHLIST ITEM TO CART
  // POST /wishlist/move-to-cart/{book_id}

  moveToCart(bookId: number): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/wishlist/move-to-cart/${bookId}`,

        {},
      )
      .pipe(
        tap(() => {
          this.refreshWishlistCount();

          this.wishlistChanged.next();
        }),
      );
  }

  // CLEAR WISHLIST
  // DELETE /wishlist/clear

  clearWishlist(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/wishlist/clear`).pipe(
      tap(() => {
        // Reset navbar wishlist count
        this.wishlistCountSubject.next(0);

        // Notify other components
        this.wishlistChanged.next();
      }),
    );
  }

  // REFRESH WISHLIST COUNT

  refreshWishlistCount(): void {
    this.getWishlist().subscribe({
      next: (response) => {
        this.wishlistCountSubject.next(response.data.wishlist_count);
      },

      error: (err) => {
        console.error('Failed to refresh wishlist count', err);

        this.wishlistCountSubject.next(0);
      },
    });
  }

  // RESET COUNT

  resetWishlistCount(): void {
    this.wishlistCountSubject.next(0);
  }
}
