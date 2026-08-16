import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';

import { Subscription, finalize } from 'rxjs';

import { WishlistService } from '../../services/wishlist-service';

import { CartService } from '../../services/cart-service';

import { AuthService } from '../../services/auth-services';

import { WishlistItem } from '../../interface/wishlist-interface';

@Component({
  selector: 'app-wishlist',

  standalone: true,

  imports: [CommonModule, RouterModule],

  templateUrl: './wishlist.html',

  styleUrls: ['./wishlist.css'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  // SERVICES

  private readonly wishlistService = inject(WishlistService);

  private readonly cartService = inject(CartService);

  private readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  // SUBSCRIPTIONS

  private readonly subscriptions = new Subscription();

  // DATA

  wishlistItems: WishlistItem[] = [];

  wishlistCount = 0;

  // STATE

  loading = false;

  actionLoadingBookId: number | null = null;

  clearingWishlist = false;

  errorMessage = '';

  successMessage = '';

  actionErrorMessage = '';

  // IMAGE

  readonly placeholderImage = 'assets/images/no-book.png';

  // MESSAGE TIMER

  private messageTimer?: ReturnType<typeof setTimeout>;

  // INIT

  ngOnInit(): void {
    // -----------------------------------------------
    // User must be logged in
    // -----------------------------------------------

    if (!this.auth.isUserLoggedIn()) {
      this.loading = false;

      this.errorMessage = 'Please login to view your wishlist.';

      this.cdr.markForCheck();

      return;
    }

    // -----------------------------------------------
    // Load immediately when page opens
    // -----------------------------------------------

    this.loadWishlist();

    // -----------------------------------------------
    // Reload whenever wishlist changes elsewhere
    // -----------------------------------------------

    this.subscriptions.add(
      this.wishlistService.wishlistChanged.subscribe(() => {
        this.loadWishlist();
      }),
    );
  }

  // LOAD WISHLIST

  loadWishlist(): void {
    if (!this.auth.isUserLoggedIn()) {
      this.loading = false;

      this.wishlistItems = [];

      this.wishlistCount = 0;

      this.errorMessage = 'Please login to view your wishlist.';

      return;
    }

    this.loading = true;

    this.errorMessage = '';

    const subscription = this.wishlistService
      .getWishlist()
      .pipe(
        // IMPORTANT:
        // loading always becomes false.
        // Success or error does not matter.

        finalize(() => {
          this.loading = false;

          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          this.wishlistItems = Array.isArray(response.data.items) ? response.data.items : [];

          this.wishlistCount = Number(response.data.wishlist_count ?? this.wishlistItems.length);

          this.errorMessage = '';

          this.cdr.markForCheck();
        },

        error: (err) => {
          console.error('Failed to load wishlist', err);

          this.wishlistItems = [];

          this.wishlistCount = 0;

          this.errorMessage =
            err?.error?.message ??
            err?.error?.detail ??
            'Unable to load wishlist. Please try again.';

          this.cdr.markForCheck();
        },
      });

    this.subscriptions.add(subscription);
  }

  // REMOVE ITEM

  removeFromWishlist(bookId: number): void {
    if (this.actionLoadingBookId !== null) {
      return;
    }

    this.actionLoadingBookId = bookId;

    const subscription = this.wishlistService
      .removeFromWishlist(bookId)
      .pipe(
        finalize(() => {
          this.actionLoadingBookId = null;

          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          // Update local UI immediately

          this.wishlistItems = this.wishlistItems.filter((item) => item.book_id !== bookId);

          this.wishlistCount = this.wishlistItems.length;

          this.showSuccessMessage('Book removed from your wishlist.');

          this.cdr.markForCheck();
        },

        error: (err) => {
          console.error('Failed to remove wishlist item', err);

          this.showActionError(
            err?.error?.message ?? err?.error?.detail ?? 'Unable to remove book from wishlist.',
          );
        },
      });

    this.subscriptions.add(subscription);
  }

  // MOVE TO CART

  moveToCart(bookId: number): void {
    if (this.actionLoadingBookId !== null) {
      return;
    }

    const item = this.wishlistItems.find((wishlistItem) => wishlistItem.book_id === bookId);

    // -----------------------------------------------
    // Already in cart
    // -----------------------------------------------

    if (item?.in_cart) {
      this.showInfoMessage('This book is already in your cart.');

      return;
    }

    this.actionLoadingBookId = bookId;

    const subscription = this.wishlistService
      .moveToCart(bookId)
      .pipe(
        finalize(() => {
          this.actionLoadingBookId = null;

          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          // move-to-cart removes it from wishlist

          this.wishlistItems = this.wishlistItems.filter(
            (wishlistItem) => wishlistItem.book_id !== bookId,
          );

          this.wishlistCount = this.wishlistItems.length;

          // Cart badge refresh
          this.cartService.refreshCartCount();

          this.showSuccessMessage('Book moved to cart successfully!');

          this.cdr.markForCheck();
        },

        error: (err) => {
          console.error('Failed to move book to cart', err);

          this.showActionError(
            err?.error?.message ?? err?.error?.detail ?? 'Unable to move book to cart.',
          );
        },
      });

    this.subscriptions.add(subscription);
  }

  // CLEAR ENTIRE WISHLIST

  clearWishlist(): void {
    if (this.wishlistItems.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to remove all books from your wishlist?',
    );

    if (!confirmed) {
      return;
    }

    this.wishlistService.clearWishlist().subscribe({
      next: (response) => {
        console.log(response?.message || 'Wishlist cleared successfully.');

        // Immediately update UI
        this.wishlistItems = [];

        this.errorMessage = '';
      },

      error: (err) => {
        console.error('Failed to clear wishlist', err);

        this.errorMessage = err?.error?.message || 'Unable to clear wishlist. Please try again.';
      },
    });
  }

  // NAVIGATION

  continueShopping(): void {
    this.router.navigate(['/books']);
  }

  viewBook(bookId: number): void {
    this.router.navigate(['/book-details', bookId]);
  }

  // HELPERS

  get hasWishlistItems(): boolean {
    return this.wishlistItems.length > 0;
  }

  isActionLoading(bookId: number): boolean {
    return this.actionLoadingBookId === bookId;
  }

  trackByWishlist(_index: number, item: WishlistItem): number {
    return item.id;
  }

  // IMAGE ERROR

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.onerror = null;

    image.src = this.placeholderImage;
  }

  // SUCCESS TOAST

  private showSuccessMessage(message: string): void {
    this.successMessage = message;

    this.actionErrorMessage = '';

    this.clearMessageTimer();

    this.messageTimer = setTimeout(() => {
      this.successMessage = '';

      this.cdr.markForCheck();
    }, 2800);

    this.cdr.markForCheck();
  }

  // INFO MESSAGE

  private showInfoMessage(message: string): void {
    this.successMessage = message;

    this.actionErrorMessage = '';

    this.clearMessageTimer();

    this.messageTimer = setTimeout(() => {
      this.successMessage = '';

      this.cdr.markForCheck();
    }, 2800);

    this.cdr.markForCheck();
  }

  // ERROR TOAST

  private showActionError(message: string): void {
    this.actionErrorMessage = message;

    this.successMessage = '';

    this.clearMessageTimer();

    this.messageTimer = setTimeout(() => {
      this.actionErrorMessage = '';

      this.cdr.markForCheck();
    }, 3500);

    this.cdr.markForCheck();
  }

  private clearMessageTimer(): void {
    if (this.messageTimer) {
      clearTimeout(this.messageTimer);
    }
  }

  // DESTROY

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    this.clearMessageTimer();
  }
}
