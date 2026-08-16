import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  finalize,
  takeUntil,
} from 'rxjs';

import { CategoriesService } from '../../services/categories-service';
import { BookService } from '../../services/bookservices';
import { CartService } from '../../services/cart-service';
import { WishlistService } from '../../services/wishlist-service';
import { AuthService } from '../../services/auth-services';

import { Category } from '../../interface/category-interface';
import { Book } from '../../interface/bookinterface';
import { CartItem } from '../../interface/cart-interface';
import { WishlistItem } from '../../interface/wishlist-interface';
import { StockStatusPipe } from '../../pipes/books-pipe-pipe';

type ToastType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-categoriespage',
  imports: [CommonModule, FormsModule, StockStatusPipe],
  templateUrl: './categoriespage.html',
  styleUrls: ['./categoriespage.css'],
})
export class Categoriespage implements OnInit, OnDestroy {
  // SERVICES
  private readonly categoriesService = inject(CategoriesService);
  private readonly bookService = inject(BookService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly store = inject(Store);

  // DESTROY
  private readonly destroy$ = new Subject<void>();

  // DATA
  categories: Category[] = [];

  books: Book[] = [];

  // LOADING
  loading = true;

  categoriesLoading = true;

  loadError = '';

  // FILTERS
  selectedCategory: number | null = null;

  search = '';

  sortBy = 'newest';

  minPrice: number | null = null;

  maxPrice: number | null = null;

  // PAGINATION

  page = 1;

  limit = 12;

  total = 0;

  // CART / WISHLIST

  cartBookIds = new Set<number>();

  wishlistBookIds = new Set<number>();

  processingCartIds = new Set<number>();

  processingWishlistIds = new Set<number>();

  // SEARCH

  private readonly searchSubject = new Subject<string>();

  // REQUEST CONTROL

  private booksRequest?: Subscription;

  // TOAST

  toastVisible = false;

  toastMessage = '';

  toastType: ToastType = 'success';

  private toastTimer?: ReturnType<typeof setTimeout>;

  // IMAGE

  readonly placeholderImage = 'assets/images/no-book.png';

  // INIT

  ngOnInit(): void {
    /*
     * IMPORTANT:
     * Load books immediately.
     *
     * This fixes the issue where the page initially shows
     * "No Books Found" until Reset Filters is clicked.
     */

    this.loadBooks();

    this.loadCategories();

    if (this.auth.isUserLoggedIn()) {
      this.loadCart();

      this.loadWishlist();
    }

    // Debounced search
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 1;

        this.loadBooks();
      });
  }

  // BOOK API

  loadBooks(): void {
    /*
     * Cancel previous request when filters change quickly.
     */

    this.booksRequest?.unsubscribe();

    this.loading = true;

    this.loadError = '';

    this.cdr.detectChanges();

    this.booksRequest = this.bookService
      .getBooks(
        this.page,
        this.limit,
        this.search.trim(),
        this.selectedCategory,
        this.minPrice,
        this.maxPrice,
        this.sortBy,
      )
      .pipe(
        finalize(() => {
          this.loading = false;

          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          console.log('Books API response:', response);

          this.books = Array.isArray(response?.items) ? response.items : [];

          this.total = Number(response?.total ?? 0);

          this.page = Number(response?.page ?? this.page);
          this.books.forEach((book) => {
            if (book.in_cart) {
              this.cartBookIds.add(book.id);
            }

            if (book.in_wishlist) {
              this.wishlistBookIds.add(book.id);
            }
          });

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Failed to load books:', err);

          this.books = [];

          this.total = 0;

          this.loadError =
            err?.error?.detail ?? err?.error?.message ?? 'Unable to load books. Please try again.';

          this.cdr.detectChanges();
        },
      });
  }

  // CATEGORY API
  // GET /categories

  loadCategories(): void {
    this.categoriesLoading = true;

    this.categoriesService
      .getCategories()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.categoriesLoading = false;

          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (categories) => {
          this.categories = Array.isArray(categories) ? categories : [];

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Failed to load categories:', err);

          this.categories = [];
        },
      });
  }

  // CATEGORY

  selectCategory(category: Category | null): void {
    this.selectedCategory = category?.id ?? null;

    this.page = 1;

    this.loadBooks();
  }

  // SEARCH

  onSearchChange(value: string): void {
    this.search = value;

    this.searchSubject.next(value.trim());
  }

  clearSearch(): void {
    this.search = '';

    this.page = 1;

    this.loadBooks();
  }

  // SORT

  setSort(value: string): void {
    if (this.sortBy === value) {
      return;
    }

    this.sortBy = value;

    this.page = 1;

    this.loadBooks();
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    this.sortBy = value;

    this.page = 1;

    this.loadBooks();
  }

  // PRICE FILTER

  applyPriceFilter(): void {
    if (this.minPrice !== null && this.maxPrice !== null && this.minPrice > this.maxPrice) {
      this.showMessage('Minimum price cannot be greater than maximum price.', 'error');

      return;
    }

    this.page = 1;

    this.loadBooks();
  }

  clearPriceFilter(): void {
    this.minPrice = null;

    this.maxPrice = null;

    this.page = 1;

    this.loadBooks();
  }

  // RESET

  resetFilters(): void {
    this.selectedCategory = null;

    this.search = '';

    this.sortBy = 'newest';

    this.minPrice = null;

    this.maxPrice = null;

    this.page = 1;

    this.loadBooks();
  }

  // FILTER STATE

  get hasActiveFilters(): boolean {
    return (
      this.selectedCategory !== null ||
      this.search.trim() !== '' ||
      this.minPrice !== null ||
      this.maxPrice !== null ||
      (this.sortBy !== '' && this.sortBy !== 'newest')
    );
  }

  // PAGINATION

  previousPage(): void {
    if (this.page <= 1 || this.loading) {
      return;
    }

    this.page--;

    this.loadBooks();

    this.scrollToProducts();
  }

  nextPage(): void {
    if (this.page >= this.totalPages || this.loading) {
      return;
    }

    this.page++;

    this.loadBooks();

    this.scrollToProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page || this.loading) {
      return;
    }

    this.page = page;

    this.loadBooks();

    this.scrollToProducts();
  }

  get totalPages(): number {
    if (this.total <= 0) {
      return 1;
    }

    return Math.ceil(this.total / this.limit);
  }

  get pages(): number[] {
    const total = this.totalPages;

    const current = this.page;

    const start = Math.max(1, current - 2);

    const end = Math.min(total, start + 4);

    const actualStart = Math.max(1, end - 4);

    return Array.from(
      {
        length: end - actualStart + 1,
      },
      (_, index) => actualStart + index,
    );
  }

  private scrollToProducts(): void {
    setTimeout(() => {
      document.querySelector('.shop-main')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  // SELECTED CATEGORY

  getSelectedCategoryName(): string {
    if (this.selectedCategory === null) {
      return 'All Books';
    }

    const category = this.categories.find((item) => item.id === this.selectedCategory);

    return category?.name ?? 'Books';
  }

  get selectedCategoryObject(): Category | undefined {
    return this.categories.find((category) => category.id === this.selectedCategory);
  }

  // CART API
  // GET /cart

  loadCart(): void {
    if (!this.auth.isUserLoggedIn()) {
      return;
    }

    this.cartService
      .getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.cartBookIds.clear();

          const items = response?.data?.items ?? [];

          items.forEach((item: CartItem) => {
            this.cartBookIds.add(item.book_id);
          });

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Failed to load cart:', err);
        },
      });
  }

  // WISHLIST API
  // GET /wishlist

  loadWishlist(): void {
    if (!this.auth.isUserLoggedIn()) {
      return;
    }

    this.wishlistService
      .getWishlist()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.wishlistBookIds.clear();

          const items = response?.data?.items ?? [];

          items.forEach((item: WishlistItem) => {
            this.wishlistBookIds.add(item.book_id);
          });

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Failed to load wishlist:', err);
        },
      });
  }

  // STATE HELPERS

  isInCart(book: Book): boolean {
    return this.cartBookIds.has(book.id) || book.in_cart === true;
  }

  isInWishlist(book: Book): boolean {
    return this.wishlistBookIds.has(book.id) || book.in_wishlist === true;
  }

  isCartProcessing(bookId: number): boolean {
    return this.processingCartIds.has(bookId);
  }

  isWishlistProcessing(bookId: number): boolean {
    return this.processingWishlistIds.has(bookId);
  }

  // ADD TO CART
  // POST /cart/add

  addToCart(book: Book): void {
    if (!book?.id) {
      return;
    }

    if (!this.auth.isUserLoggedIn()) {
      this.showMessage('Please login to add books to your cart.', 'info');

      this.router.navigate(['/login']);

      return;
    }

    if (book.stock <= 0) {
      this.showMessage('This book is currently out of stock.', 'error');

      return;
    }

    if (this.isInCart(book) || this.isCartProcessing(book.id)) {
      return;
    }

    this.processingCartIds.add(book.id);

    this.cartService
      .addToCart({
        book_id: book.id,
        quantity: 1,
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.processingCartIds.delete(book.id);

          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          this.cartBookIds.add(book.id);

          book.in_cart = true;

          this.cartService.cartChanged.next();

          this.showMessage(response?.message ?? 'Book added to cart.', 'success');

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Add to cart failed:', err);

          this.showMessage(
            err?.error?.detail ?? err?.error?.message ?? 'Unable to add book to cart.',
            'error',
          );
        },
      });
  }

  // REMOVE FROM CART
  // DELETE /cart/remove/{book_id}

  removeFromCart(book: Book): void {
    if (!book?.id || this.isCartProcessing(book.id)) {
      return;
    }

    this.processingCartIds.add(book.id);

    this.cartService
      .removeFromCart(book.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.processingCartIds.delete(book.id);

          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          this.cartBookIds.delete(book.id);

          book.in_cart = false;

          this.cartService.cartChanged.next();

          this.showMessage(response?.message ?? 'Book removed from cart.', 'success');

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Remove from cart failed:', err);

          this.showMessage(
            err?.error?.detail ?? err?.error?.message ?? 'Unable to remove book from cart.',
            'error',
          );
        },
      });
  }

  // TOGGLE CART

  toggleCart(book: Book): void {
    if (this.isCartProcessing(book.id)) {
      return;
    }

    if (this.isInCart(book)) {
      this.removeFromCart(book);

      return;
    }

    this.addToCart(book);
  }

  // ADD WISHLIST

  addToWishlist(book: Book): void {
    if (!book?.id) {
      return;
    }

    if (!this.auth.isUserLoggedIn()) {
      this.showMessage('Please login to use your wishlist.', 'info');

      this.router.navigate(['/login']);

      return;
    }

    if (this.isInWishlist(book) || this.isWishlistProcessing(book.id)) {
      return;
    }

    this.processingWishlistIds.add(book.id);

    this.wishlistService
      .addToWishlist(book.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.processingWishlistIds.delete(book.id);

          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          this.wishlistBookIds.add(book.id);

          book.in_wishlist = true;

          this.wishlistService.wishlistChanged.next();

          this.showMessage(response?.message ?? 'Added to wishlist.', 'success');

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Add wishlist failed:', err);

          this.showMessage(
            err?.error?.detail ?? err?.error?.message ?? 'Unable to add to wishlist.',
            'error',
          );
        },
      });
  }

  // REMOVE WISHLIST

  removeFromWishlist(book: Book): void {
    if (!book?.id || this.isWishlistProcessing(book.id)) {
      return;
    }

    this.processingWishlistIds.add(book.id);

    this.wishlistService
      .removeFromWishlist(book.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.processingWishlistIds.delete(book.id);

          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          this.wishlistBookIds.delete(book.id);

          book.in_wishlist = false;

          this.wishlistService.wishlistChanged.next();

          this.showMessage(response?.message ?? 'Removed from wishlist.', 'success');

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Remove wishlist failed:', err);

          this.showMessage(
            err?.error?.detail ?? err?.error?.message ?? 'Unable to remove from wishlist.',
            'error',
          );
        },
      });
  }

  // TOGGLE WISHLIST

  toggleWishlist(book: Book): void {
    if (this.isWishlistProcessing(book.id)) {
      return;
    }

    if (this.isInWishlist(book)) {
      this.removeFromWishlist(book);

      return;
    }

    this.addToWishlist(book);
  }

  // RATING

  getRating(book: Book): number {
    const rating = Number(book.rating ?? 0);

    if (Number.isNaN(rating) || rating < 0) {
      return 0;
    }

    return Math.min(5, rating);
  }

  // IMAGE

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.onerror = null;

    image.src = this.placeholderImage;
  }

  // ROUTING

  openBook(book: Book): void {
    if (!book?.id) {
      return;
    }

    this.router.navigate(['/book-details', book.id]);
  }

  viewAllBooks(): void {
    this.resetFilters();
  }

  // TOAST

  private showMessage(message: string, type: ToastType): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastMessage = message;

    this.toastType = type;

    this.toastVisible = true;

    this.cdr.detectChanges();

    this.toastTimer = setTimeout(() => {
      this.closeToast();
    }, 3000);
  }

  closeToast(): void {
    this.toastVisible = false;

    this.toastMessage = '';

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);

      this.toastTimer = undefined;
    }

    this.cdr.detectChanges();
  }

  // TRACK BY

  trackBook(index: number, book: Book): number {
    return book.id;
  }

  trackCategory(index: number, category: Category): number {
    return category.id;
  }

  // DESTROY

  ngOnDestroy(): void {
    this.booksRequest?.unsubscribe();

    this.destroy$.next();

    this.destroy$.complete();

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }
}
