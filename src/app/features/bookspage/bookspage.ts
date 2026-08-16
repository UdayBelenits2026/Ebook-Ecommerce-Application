import { CommonModule } from '@angular/common';

import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Book, BookResponse } from '../../interface/bookinterface';

import { BookService } from '../../services/bookservices';
import { CartService } from '../../services/cart-service';
import { WishlistService } from '../../services/wishlist-service';
import { AuthService } from '../../services/auth-services';
import { StockStatusPipe } from '../../pipes/books-pipe-pipe';

@Component({
  selector: 'app-bookspage',

  standalone: true,

  imports: [CommonModule, FormsModule, StockStatusPipe],

  templateUrl: './bookspage.html',
  styleUrls: ['./bookspage.css'],
})
export class Bookspage implements OnInit, OnDestroy {
  // SERVICES

  private readonly bookService = inject(BookService);

  private readonly cartService = inject(CartService);

  private readonly wishlistService = inject(WishlistService);

  readonly auth = inject(AuthService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  // BOOK DATA

  books: Book[] = [];

  categories: {
    id: number;
    name: string;
  }[] = [];

  // LOADING / ERROR

  loading = false;

  errorMessage = '';

  successMessage = '';

  actionErrorMessage = '';

  // PAGINATION

  page = 1;

  limit = 12;

  total = 0;

  // FILTERS

  search = '';

  category_id: number | null = null;

  min_price: number | null = null;

  max_price: number | null = null;

  sort_by = '';

  // CART / WISHLIST STATE

  wishlistBookIds = new Set<number>();

  cartBookIds = new Set<number>();

  cartCount = 0;

  // IMAGE

  readonly placeholderImage = 'assets/images/no-book.png';

  // SUBSCRIPTIONS / TIMERS

  private querySub?: Subscription;

  private messageTimer?: ReturnType<typeof setTimeout>;

  // INIT

  ngOnInit(): void {
    this.querySub = this.route.queryParams.subscribe((params) => {
      const categoryId = params['category_id'];

      this.category_id = categoryId ? Number(categoryId) : null;

      this.search = String(params['search'] ?? '').trim();

      this.page = 1;

      this.loadBooks();
    });

    if (this.auth.isUserLoggedIn()) {
      this.loadWishlistState();

      this.loadCartState();
    }
  }
  GotoBook(id: number): void {
    this.router.navigate(['/book-details', id]);
  }

  // DESTROY

  ngOnDestroy(): void {
    this.querySub?.unsubscribe();

    if (this.messageTimer) {
      clearTimeout(this.messageTimer);
    }
  }

  // LOAD BOOKS

  loadBooks(): void {
    this.loading = true;

    this.errorMessage = '';

    this.bookService
      .getBooks(
        this.page,
        this.limit,
        this.search,
        this.category_id ?? undefined,
        this.min_price ?? undefined,
        this.max_price ?? undefined,
        this.sort_by,
      )
      .subscribe({
        next: (response: BookResponse) => {
          this.books = Array.isArray(response.items) ? response.items : [];

          this.total = Number(response.total) || 0;

          // -----------------------------------------------
          // Build categories from returned books
          // -----------------------------------------------

          const categoryMap = new Map<number, string>();

          this.books.forEach((book) => {
            if (book.category_id != null) {
              if (!categoryMap.has(book.category_id)) {
                categoryMap.set(
                  book.category_id,

                  book.category_name || `Category ${book.category_id}`,
                );
              }
            }

            // ---------------------------------------------
            // Backend supplied wishlist state
            // ---------------------------------------------

            if (book.in_wishlist) {
              this.wishlistBookIds.add(book.id);
            }

            // ---------------------------------------------
            // Backend supplied cart state
            // ---------------------------------------------

            if (book.in_cart) {
              this.cartBookIds.add(book.id);
            }
          });

          this.categories = Array.from(
            categoryMap,

            ([id, name]) => ({
              id,

              name,
            }),
          );

          this.loading = false;

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('Failed to load books', error);

          this.books = [];

          this.total = 0;

          this.loading = false;

          this.errorMessage =
            error?.error?.message ?? error?.error?.detail ?? 'Unable to load books.';

          this.cdr.markForCheck();
        },
      });
  }

  // LOAD WISHLIST STATE

  private loadWishlistState(): void {
    if (!this.auth.isUserLoggedIn()) {
      return;
    }

    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlistBookIds.clear();

        response.data.items.forEach((item) => {
          this.wishlistBookIds.add(item.book_id);
        });

        // Synchronize books
        this.books.forEach((book) => {
          book.in_wishlist = this.wishlistBookIds.has(book.id);
        });

        this.cdr.markForCheck();
      },

      error: (err) => {
        console.error('Failed to load wishlist', err);
      },
    });
  }

  // LOAD CART STATE

  private loadCartState(): void {
    if (!this.auth.isUserLoggedIn()) {
      return;
    }

    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cartBookIds.clear();

        response.data.items.forEach((item) => {
          this.cartBookIds.add(item.book_id);
        });

        this.cartCount = response.data.cart_count;

        // Synchronize book state
        this.books.forEach((book) => {
          book.in_cart = this.cartBookIds.has(book.id);
        });

        this.cdr.markForCheck();
      },

      error: (err) => {
        console.error('Failed to load cart', err);
      },
    });
  }

  // ADD TO CART

  addToCart(bookId: number): void {
    if (!this.auth.isUserLoggedIn()) {
      alert('Please login to continue.');

      this.router.navigate(['/login']);

      return;
    }

    // Already in cart
    if (this.cartBookIds.has(bookId)) {
      this.showSuccessMessage('This book is already in your cart.');

      return;
    }

    this.cartService
      .addToCart({
        book_id: bookId,

        quantity: 1,
      })
      .subscribe({
        next: () => {
          this.cartBookIds.add(bookId);

          const book = this.books.find((item) => item.id === bookId);

          if (book) {
            book.in_cart = true;
          }

          this.cartCount++;

          this.showSuccessMessage('Book added to cart successfully!');

          this.cdr.markForCheck();
        },

        error: (err) => {
          console.error('Failed to add to cart', err);

          this.showActionError(
            err?.error?.message ?? err?.error?.detail ?? 'Unable to add book to cart.',
          );
        },
      });
  }

  // CHECK CART

  isInCart(bookId: number): boolean {
    return this.cartBookIds.has(bookId);
  }

  // TOGGLE WISHLIST

  toggleWishlist(bookId: number): void {
    if (!this.auth.isUserLoggedIn()) {
      alert('Please login to continue.');

      this.router.navigate(['/login']);

      return;
    }

    // =====================================================
    // REMOVE FROM WISHLIST
    // =====================================================

    if (this.wishlistBookIds.has(bookId)) {
      this.wishlistService.removeFromWishlist(bookId).subscribe({
        next: () => {
          this.wishlistBookIds.delete(bookId);

          this.updateBookWishlistState(bookId, false);

          this.showSuccessMessage('Book removed from wishlist.');

          this.cdr.markForCheck();
        },

        error: (err) => {
          console.error('Failed to remove from wishlist', err);

          this.showActionError(
            err?.error?.message ?? err?.error?.detail ?? 'Unable to remove book from wishlist.',
          );
        },
      });

      return;
    }

    // =====================================================
    // ADD TO WISHLIST
    // =====================================================

    this.wishlistService.addToWishlist(bookId).subscribe({
      next: () => {
        this.wishlistBookIds.add(bookId);

        this.updateBookWishlistState(bookId, true);

        this.showSuccessMessage('Book added to wishlist!');

        this.cdr.markForCheck();
      },

      error: (err) => {
        console.error('Failed to add to wishlist', err);

        this.showActionError(
          err?.error?.message ?? err?.error?.detail ?? 'Unable to add book to wishlist.',
        );
      },
    });
  }

  // UPDATE LOCAL WISHLIST STATE

  private updateBookWishlistState(bookId: number, state: boolean): void {
    const book = this.books.find((item) => item.id === bookId);

    if (book) {
      book.in_wishlist = state;
    }
  }

  // IS WISHLISTED

  isWishlisted(bookId: number): boolean {
    return this.wishlistBookIds.has(bookId);
  }

  // SUCCESS MESSAGE

  private showSuccessMessage(message: string): void {
    this.successMessage = message;

    this.actionErrorMessage = '';

    if (this.messageTimer) {
      clearTimeout(this.messageTimer);
    }

    this.messageTimer = setTimeout(() => {
      this.successMessage = '';

      this.cdr.markForCheck();
    }, 2500);

    this.cdr.markForCheck();
  }

  // ERROR MESSAGE

  private showActionError(message: string): void {
    this.actionErrorMessage = message;

    this.successMessage = '';

    if (this.messageTimer) {
      clearTimeout(this.messageTimer);
    }

    this.messageTimer = setTimeout(() => {
      this.actionErrorMessage = '';

      this.cdr.markForCheck();
    }, 3000);

    this.cdr.markForCheck();
  }

  // CLEAR CATEGORY

  clearCategoryFilter(): void {
    this.category_id = null;

    this.page = 1;

    this.router.navigate(['/books'], {
      queryParams: {},
    });
  }

  // ACTIVE CATEGORY

  hasActiveCategoryFilter(): boolean {
    return this.category_id !== null;
  }

  // SEARCH

  onSearch(): void {
    this.page = 1;

    this.loadBooks();
  }

  // SORT

  onSortChange(): void {
    this.page = 1;

    this.loadBooks();
  }

  // RESET FILTERS

  resetFilters(): void {
    this.search = '';

    this.category_id = null;

    this.min_price = null;

    this.max_price = null;

    this.sort_by = '';

    this.page = 1;

    this.router.navigate(['/books'], {
      queryParams: {},
    });

    this.loadBooks();
  }

  // CHANGE PAGE

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page) {
      return;
    }

    this.page = page;

    this.loadBooks();
  }

  // CHANGE LIMIT

  changeLimit(limit: number): void {
    const newLimit = Number(limit);

    if (!newLimit || newLimit < 1) {
      return;
    }

    this.limit = newLimit;

    this.page = 1;

    this.loadBooks();
  }

  // TOTAL PAGES

  get totalPages(): number {
    return Math.max(
      1,

      Math.ceil(this.total / this.limit),
    );
  }

  // TRACK BY

  trackByBook(_index: number, book: Book): number {
    return book.id;
  }

  // IMAGE ERROR

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.onerror = null;

    image.src = this.placeholderImage;
  }
}
