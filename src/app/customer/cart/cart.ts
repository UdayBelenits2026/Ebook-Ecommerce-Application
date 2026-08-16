import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';

import { Subscription, finalize } from 'rxjs';

import { Store } from '@ngrx/store';

import { CartService } from '../../services/cart-service';

import { CartItem } from '../../interface/cart-interface';

import { AuthService } from '../../services/auth-services';

import * as CartActions from '../../store/cart/cart.actions';

import {
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCartShipping,
  selectCartGrandTotal,
  selectCartLoading,
  selectCartError,
} from '../../store/cart/cart.selectors';

@Component({
  selector: 'app-cart',

  standalone: true,

  imports: [CommonModule, RouterLink],

  templateUrl: './cart.html',

  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit, OnDestroy {
  // SERVICES

  private readonly cartService = inject(CartService);

  readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly store = inject(Store);

  // SUBSCRIPTIONS

  private readonly subscriptions = new Subscription();

  // CART DATA

  cartItems: CartItem[] = [];

  cartCount = 0;

  subtotal = 0;

  shipping = 0;

  grandTotal = 0;

  // Kept for older HTML references
  total = 0;

  // PAGE STATE

  loading = false;

  clearingCart = false;

  errorMessage = '';

  emptyMessage = '';

  // ITEM PROCESSING

  processingBookIds = new Set<number>();

  // TOAST

  toastMessage = '';

  toastType: 'success' | 'error' | 'info' = 'success';

  showToastMessage = false;

  private toastTimer?: ReturnType<typeof setTimeout>;

  // IMAGE

  readonly placeholderImage = 'assets/images/no-book.png';

  // INIT

  ngOnInit(): void {
    // =======================================================
    // LOAD CART
    // =======================================================

    if (this.auth.isUserLoggedIn()) {
      this.store.dispatch(CartActions.loadCart());
    }

    // =======================================================
    // CART ITEMS
    // =======================================================

    this.subscriptions.add(
      this.store.select(selectCartItems).subscribe({
        next: (items) => {
          console.log('Cart items changed:', items);

          this.cartItems = Array.isArray(items) ? items : [];

          if (this.cartItems.length === 0 && !this.loading) {
            this.emptyMessage = this.auth.isUserLoggedIn()
              ? 'Your cart is empty.'
              : 'Please login to view your cart.';
          } else {
            this.emptyMessage = '';
          }

          this.detectChanges();
        },
      }),
    );

    // =======================================================
    // CART COUNT
    // =======================================================

    this.subscriptions.add(
      this.store.select(selectCartCount).subscribe({
        next: (count) => {
          console.log('Cart count changed:', count);

          this.cartCount = Number(count) || 0;

          this.detectChanges();
        },
      }),
    );

    // =======================================================
    // SUBTOTAL
    // =======================================================

    this.subscriptions.add(
      this.store.select(selectCartSubtotal).subscribe({
        next: (value) => {
          this.subtotal = Number(value) || 0;

          this.detectChanges();
        },
      }),
    );

    // =======================================================
    // SHIPPING
    // =======================================================

    this.subscriptions.add(
      this.store.select(selectCartShipping).subscribe({
        next: (value) => {
          this.shipping = Number(value) || 0;

          this.detectChanges();
        },
      }),
    );

    // =======================================================
    // GRAND TOTAL
    // =======================================================

    this.subscriptions.add(
      this.store.select(selectCartGrandTotal).subscribe({
        next: (value) => {
          this.grandTotal = Number(value) || 0;

          this.total = this.grandTotal;

          this.detectChanges();
        },
      }),
    );

    // =======================================================
    // LOADING
    // =======================================================

    this.subscriptions.add(
      this.store.select(selectCartLoading).subscribe({
        next: (loading) => {
          console.log('Cart loading changed:', loading);

          this.loading = loading;

          this.detectChanges();
        },
      }),
    );

    // =======================================================
    // ERROR
    // =======================================================

    this.subscriptions.add(
      this.store.select(selectCartError).subscribe({
        next: (error) => {
          this.errorMessage = error || '';

          this.detectChanges();
        },
      }),
    );

    // =======================================================
    // CART SERVICE CHANGE
    // =======================================================

    this.subscriptions.add(
      this.cartService.cartChanged.subscribe({
        next: () => {
          console.log('Cart changed from another component.');

          this.store.dispatch(CartActions.loadCart());

          this.detectChanges();
        },
      }),
    );

    this.detectChanges();
  }

  // LOAD CART

  loadCart(): void {
    if (!this.auth.isUserLoggedIn()) {
      this.loading = false;

      this.cartItems = [];

      this.resetSummary();

      this.errorMessage = '';

      this.emptyMessage = 'Please login to view your cart.';

      this.detectChanges();

      return;
    }

    this.store.dispatch(CartActions.loadCart());

    this.detectChanges();
  }

  // INCREASE QUANTITY

  increaseQuantity(item: CartItem): void {
    if (!item?.book_id) {
      return;
    }

    if (this.isProcessing(item.book_id)) {
      return;
    }

    // =======================================================
    // STOCK CHECK
    // =======================================================

    if (item.stock != null && item.quantity >= item.stock) {
      this.showToast(
        `Only ${item.stock} item(s) available in stock.`,

        'info',
      );

      return;
    }

    this.startProcessing(item.book_id);

    this.cartService
      .increaseQuantity(item.book_id)
      .pipe(
        finalize(() => {
          this.stopProcessing(item.book_id);
        }),
      )
      .subscribe({
        next: () => {
          this.showToast('Book quantity increased.', 'success');

          this.loadCart();

          this.detectChanges();
        },

        error: (err) => {
          console.error('Failed to increase quantity:', err);

          this.showToast(
            this.getErrorMessage(
              err,

              'Unable to increase quantity.',
            ),

            'error',
          );

          this.detectChanges();
        },
      });
  }

  // DECREASE QUANTITY

  decreaseQuantity(item: CartItem): void {
    if (!item?.book_id) {
      return;
    }

    if (this.isProcessing(item.book_id)) {
      return;
    }

    this.startProcessing(item.book_id);

    this.cartService
      .decreaseQuantity(item.book_id)
      .pipe(
        finalize(() => {
          this.stopProcessing(item.book_id);
        }),
      )
      .subscribe({
        next: () => {
          if (item.quantity <= 1) {
            this.showToast('Book removed from cart.', 'success');
          } else {
            this.showToast('Book quantity decreased.', 'success');
          }

          this.loadCart();

          this.detectChanges();
        },

        error: (err) => {
          console.error('Failed to decrease quantity:', err);

          this.showToast(
            this.getErrorMessage(
              err,

              'Unable to decrease quantity.',
            ),

            'error',
          );

          this.detectChanges();
        },
      });
  }

  // REMOVE ITEM

  removeItem(bookId: number): void {
    if (!bookId) {
      return;
    }

    if (this.isProcessing(bookId)) {
      return;
    }

    this.startProcessing(bookId);

    this.cartService
      .removeFromCart(bookId)
      .pipe(
        finalize(() => {
          this.stopProcessing(bookId);
        }),
      )
      .subscribe({
        next: () => {
          this.showToast('Book removed from cart.', 'success');

          this.loadCart();

          this.detectChanges();
        },

        error: (err) => {
          console.error('Failed to remove item:', err);

          this.showToast(
            this.getErrorMessage(
              err,

              'Failed to remove book from cart.',
            ),

            'error',
          );

          this.detectChanges();
        },
      });
  }

  // CLEAR CART

  clearCart(): void {
    if (this.cartItems.length === 0 || this.clearingCart) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to clear your entire cart?');

    if (!confirmed) {
      return;
    }

    this.clearingCart = true;

    this.detectChanges();

    this.cartService
      .clearCartApi()
      .pipe(
        finalize(() => {
          this.clearingCart = false;

          this.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.cartItems = [];

          this.resetSummary();

          this.emptyMessage = 'Your cart is empty.';

          this.cartService.resetCartCount();

          this.showToast(
            'Your cart has been cleared.',

            'success',
          );

          this.detectChanges();
        },

        error: (err) => {
          console.error('Failed to clear cart:', err);

          this.showToast(
            this.getErrorMessage(
              err,

              'Unable to clear cart.',
            ),

            'error',
          );

          this.detectChanges();
        },
      });
  }

  // CHECKOUT

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.showToast('Your cart is empty.', 'info');

      return;
    }

    this.router.navigate(['/customer/checkout']);
  }

  // PROCESSING CHECK

  isProcessing(bookId: number): boolean {
    return this.processingBookIds.has(bookId);
  }

  // START PROCESSING

  private startProcessing(bookId: number): void {
    this.processingBookIds.add(bookId);

    this.processingBookIds = new Set(this.processingBookIds);

    this.detectChanges();
  }

  // STOP PROCESSING

  private stopProcessing(bookId: number): void {
    this.processingBookIds.delete(bookId);

    this.processingBookIds = new Set(this.processingBookIds);

    this.detectChanges();
  }

  // TOAST

  showToast(
    message: string,

    type: 'success' | 'error' | 'info' = 'success',
  ): void {
    // -------------------------------------------------------
    // CLEAR PREVIOUS TIMER
    // -------------------------------------------------------

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);

      this.toastTimer = undefined;
    }

    // -------------------------------------------------------
    // SET MESSAGE
    // -------------------------------------------------------

    this.toastMessage = message;

    this.toastType = type;

    this.showToastMessage = true;

    this.detectChanges();

    // -------------------------------------------------------
    // AUTO CLOSE
    // -------------------------------------------------------

    this.toastTimer = setTimeout(() => {
      this.closeToast();
    }, 3000);
  }

  // CLOSE TOAST

  closeToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);

      this.toastTimer = undefined;
    }

    this.showToastMessage = false;

    this.toastMessage = '';

    this.detectChanges();
  }

  // IMAGE ERROR

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (!image) {
      return;
    }

    image.onerror = null;

    image.src = this.placeholderImage;

    this.detectChanges();
  }

  // TRACK BY

  trackByItem(
    _index: number,

    item: CartItem,
  ): number {
    return item.id;
  }

  // RESET SUMMARY

  private resetSummary(): void {
    this.cartCount = 0;

    this.subtotal = 0;

    this.shipping = 0;

    this.grandTotal = 0;

    this.total = 0;

    this.detectChanges();
  }

  // ERROR MESSAGE

  private getErrorMessage(
    error: any,

    fallback: string,
  ): string {
    return error?.error?.detail || error?.error?.message || error?.message || fallback;
  }

  // CHANGE DETECTION

  private detectChanges(): void {
    try {
      this.cdr.detectChanges();
    } catch {
      // Component may already be destroyed.
    }
  }

  // DESTROY

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);

      this.toastTimer = undefined;
    }
  }
}
