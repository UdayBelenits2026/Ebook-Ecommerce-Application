import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { BookService } from '../../services/bookservices';
import { CategoriesService } from '../../services/categories-service';
import { CartService } from '../../services/cart-service';
import { WishlistService } from '../../services/wishlist-service';
import { AuthService } from '../../services/auth-services';

import { Book } from '../../interface/bookinterface';
import { Category } from '../../interface/category-interface';
import { StockStatusPipe } from '../../pipes/books-pipe-pipe';

import * as CategoriesActions from '../../store/categories/categories.actions';
import { selectCategories, selectCategoriesLoading } from '../../store/categories/categories.selectors';
import * as CartActions from '../../store/cart/cart.actions';
import * as WishlistActions from '../../store/wishlist/wishlist.actions';
import { selectCartBookIds } from '../../store/cart/cart.selectors';
import { selectWishlistBookIds } from '../../store/wishlist/wishlist.selectors';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, FormsModule, StockStatusPipe],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css'],
})
export class Homepage implements OnInit, AfterViewInit, OnDestroy {
  // VIEW CHILD

  @ViewChild('categoryScroller')
  categoryScroller?: ElementRef<HTMLDivElement>;

  @ViewChild('featuredBooksScroller')
  featuredBooksScroller?: ElementRef<HTMLDivElement>;

  // SERVICES

  private readonly bookService = inject(BookService);

  private readonly categoriesService = inject(CategoriesService);

  private readonly cartService = inject(CartService);

  private readonly wishlistService = inject(WishlistService);

  readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly store = inject(Store);

  // BOOK DATA

  books: Book[] = [];

  categories: Category[] = [];

  searchText = '';

  // SELECTED CATEGORY

  selectedCategoryId: number | null = null;

  // LOADING STATES

  isLoadingFeatured = true;

  isLoadingCategories = true;

  booksErrorMessage = '';

  categoriesErrorMessage = '';

  // CART / WISHLIST

  wishlistBookIds = new Set<number>();

  cartBookIds = new Set<number>();

  processingCartIds = new Set<number>();

  processingWishlistIds = new Set<number>();

  // CATEGORY SCROLLER

  canScrollCategoriesLeft = false;

  canScrollCategoriesRight = false;

  // TOAST

  showToast = false;

  toastMessage = '';

  toastType: 'success' | 'error' | 'info' = 'success';

  private toastTimer?: ReturnType<typeof setTimeout>;

  // SUBSCRIPTIONS

  private readonly subscriptions = new Subscription();

  // FALLBACK IMAGES

  readonly placeholderImage = 'assets/images/no-book.png';

  readonly categoryPlaceholderImage = 'assets/images/no-book.png';

  // SERVICE FEATURES

  readonly services = [
    {
      icon: 'bi bi-truck',
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery for your favourite books.',
    },

    {
      icon: 'bi bi-shield-check',
      title: 'Secure Payments',
      description: 'Safe and secure checkout for every order.',
    },

    {
      icon: 'bi bi-arrow-repeat',
      title: 'Easy Shopping',
      description: 'Simple browsing, wishlist and cart management.',
    },

    {
      icon: 'bi bi-headset',
      title: 'Customer Support',
      description: 'We are here whenever you need assistance.',
    },
  ];

  // INIT

  ngOnInit(): void {
    // Load categories via NgRx
    this.store.dispatch(CategoriesActions.loadCategories());

    this.subscriptions.add(
      this.store.select(selectCategories).subscribe((categories) => {
        this.categories = categories;
        this.cdr.detectChanges();
        setTimeout(() => this.updateCategoryArrows(), 100);
      })
    );

    this.subscriptions.add(
      this.store.select(selectCategoriesLoading).subscribe((loading) => {
        this.isLoadingCategories = loading;
      })
    );

    this.loadFeaturedBooks();

    // Logged-in user states via NgRx
    if (this.auth.isUserLoggedIn()) {
      this.store.dispatch(WishlistActions.loadWishlist());
      this.store.dispatch(CartActions.loadCart());
    }

    // Subscribe to wishlist/cart book IDs from store
    this.subscriptions.add(
      this.store.select(selectWishlistBookIds).subscribe((ids) => {
        this.wishlistBookIds = ids;
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.add(
      this.store.select(selectCartBookIds).subscribe((ids) => {
        this.cartBookIds = ids;
        this.cdr.detectChanges();
      })
    );

    // WISHLIST CHANGES
    this.subscriptions.add(
      this.wishlistService.wishlistChanged.subscribe(() => {
        if (this.auth.isUserLoggedIn()) {
          this.store.dispatch(WishlistActions.loadWishlist());
        }
      }),
    );

    // CART CHANGES
    this.subscriptions.add(
      this.cartService.cartChanged.subscribe(() => {
        if (this.auth.isUserLoggedIn()) {
          this.store.dispatch(CartActions.loadCart());
        }
      }),
    );
  }

  // AFTER VIEW INIT

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateCategoryArrows();
    }, 300);
  }

  // DESTROY

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  // WINDOW RESIZE

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateCategoryArrows();
  }

  // LOAD CATEGORIES

  loadCategories(): void {
    this.store.dispatch(CategoriesActions.loadCategories());
  }

  // LOAD FEATURED BOOKS

  loadFeaturedBooks(): void {
    this.isLoadingFeatured = true;

    this.booksErrorMessage = '';

    this.bookService.getBooks(1, 12, '', null, null, null, 'newest').subscribe({
      next: (response) => {
        this.books = Array.isArray(response?.items) ? response.items : [];

        // =================================================
        // RESET STATE FROM BOOK API
        // =================================================

        this.books.forEach((book) => {
          if (book.in_wishlist) {
            this.wishlistBookIds.add(book.id);
          }

          if (book.in_cart) {
            this.cartBookIds.add(book.id);
          }
        });

        this.isLoadingFeatured = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load featured books', error);

        this.books = [];

        this.isLoadingFeatured = false;

        this.booksErrorMessage =
          error?.error?.detail ?? error?.error?.message ?? 'Unable to load books.';

        this.cdr.detectChanges();
      },
    });
  }

  // LOAD WISHLIST STATE

  private loadWishlistState(): void {
    if (!this.auth.isUserLoggedIn()) return;
    this.store.dispatch(WishlistActions.loadWishlist());
  }

  // LOAD CART STATE

  private loadCartState(): void {
    if (!this.auth.isUserLoggedIn()) return;
    this.store.dispatch(CartActions.loadCart());
  }

  // SEARCH

  searchBooks(): void {
    const value = this.searchText.trim();

    this.router.navigate(['/books'], {
      queryParams: value
        ? {
            search: value,
          }
        : {},
    });
  }

  // SEARCH ENTER KEY

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchBooks();
    }
  }

  // CLEAR SEARCH

  clearSearch(): void {
    this.searchText = '';
  }

  // FEATURED BOOKS SCROLL

  scrollFeaturedBooks(direction: 'left' | 'right'): void {
    const element = this.featuredBooksScroller?.nativeElement;

    if (!element) {
      return;
    }

    const card = element.querySelector('.homepage-book-card') as HTMLElement | null;

    const cardWidth = card?.offsetWidth ?? 225;

    const gap = 22;

    const scrollAmount = (cardWidth + gap) * 3;

    element.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  }

  // CATEGORY SCROLL

  scrollCategories(direction: 'left' | 'right'): void {
    const element = this.categoryScroller?.nativeElement;

    if (!element) {
      return;
    }

    const scrollAmount = Math.min(element.clientWidth * 0.75, 650);

    element.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,

      behavior: 'smooth',
    });

    setTimeout(() => {
      this.updateCategoryArrows();
    }, 400);
  }

  // CATEGORY SCROLL EVENT

  onCategoryScroll(): void {
    this.updateCategoryArrows();
  }

  // UPDATE CATEGORY ARROWS

  updateCategoryArrows(): void {
    const element = this.categoryScroller?.nativeElement;

    if (!element) {
      this.canScrollCategoriesLeft = false;

      this.canScrollCategoriesRight = false;

      return;
    }

    this.canScrollCategoriesLeft = element.scrollLeft > 5;

    this.canScrollCategoriesRight =
      element.scrollLeft + element.clientWidth < element.scrollWidth - 5;
  }

  // EXPLORE CATEGORY

  exploreCategory(category: Category): void {
    if (!category?.id) {
      return;
    }

    this.selectedCategoryId = category.id;

    this.router.navigate(['/books'], {
      queryParams: {
        category_id: category.id,
      },
    });
  }

  // EXPLORE ALL BOOKS

  exploreAllBooks(): void {
    this.selectedCategoryId = null;

    this.router.navigate(['/books']);
  }

  // SHOP NOW

  shopNow(): void {
    this.router.navigate(['/books']);
  }

  // VIEW BOOK

  viewBook(book: Book): void {
    if (!book?.id) {
      return;
    }

    this.router.navigate(['book-details', book.id]);
  }

  // ADD TO CART

  addToCart(book: Book, event?: Event): void {
    event?.stopPropagation();

    if (!book?.id) {
      return;
    }

    // LOGIN CHECK

    if (!this.auth.isUserLoggedIn()) {
      this.showNotification('Please login to add books to your cart.', 'info');

      this.router.navigate(['/login']);

      return;
    }

    // ALREADY IN CART

    if (this.cartBookIds.has(book.id)) {
      this.showNotification(`"${book.title}" is already in your cart.`, 'info');

      return;
    }

    // ALREADY PROCESSING

    if (this.processingCartIds.has(book.id)) {
      return;
    }

    this.processingCartIds.add(book.id);

    // API

    this.cartService
      .addToCart({
        book_id: book.id,

        quantity: 1,
      })
      .subscribe({
        next: (response) => {
          this.cartBookIds.add(book.id);

          this.processingCartIds.delete(book.id);

          this.showNotification(
            response?.message ?? `"${book.title}" added to cart.`,

            'success',
          );

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Failed to add to cart', error);

          this.processingCartIds.delete(book.id);

          this.showNotification(
            error?.error?.detail ?? error?.error?.message ?? 'Unable to add book to cart.',

            'error',
          );

          this.cdr.detectChanges();
        },
      });
  }

  // TOGGLE WISHLIST

  toggleWishlist(book: Book, event?: Event): void {
    event?.stopPropagation();

    if (!book?.id) {
      return;
    }

    // LOGIN CHECK

    if (!this.auth.isUserLoggedIn()) {
      this.showNotification('Please login to manage your wishlist.', 'info');

      this.router.navigate(['/login']);

      return;
    }

    // PROCESSING CHECK

    if (this.processingWishlistIds.has(book.id)) {
      return;
    }

    this.processingWishlistIds.add(book.id);

    // REMOVE FROM WISHLIST

    if (this.wishlistBookIds.has(book.id)) {
      this.wishlistService.removeFromWishlist(book.id).subscribe({
        next: (response) => {
          this.wishlistBookIds.delete(book.id);

          this.processingWishlistIds.delete(book.id);

          this.showNotification(
            response?.message ?? `"${book.title}" removed from wishlist.`,

            'info',
          );

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Failed to remove wishlist item', error);

          this.processingWishlistIds.delete(book.id);

          this.showNotification(
            error?.error?.detail ?? error?.error?.message ?? 'Unable to update wishlist.',

            'error',
          );

          this.cdr.detectChanges();
        },
      });

      return;
    }

    // ADD TO WISHLIST

    this.wishlistService.addToWishlist(book.id).subscribe({
      next: (response) => {
        this.wishlistBookIds.add(book.id);

        this.processingWishlistIds.delete(book.id);

        this.showNotification(
          response?.message ?? `"${book.title}" added to wishlist.`,

          'success',
        );

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to add wishlist item', error);

        this.processingWishlistIds.delete(book.id);

        this.showNotification(
          error?.error?.detail ?? error?.error?.message ?? 'Unable to update wishlist.',

          'error',
        );

        this.cdr.detectChanges();
      },
    });
  }

  // IS WISHLISTED

  isWishlisted(book: Book): boolean {
    return this.wishlistBookIds.has(book.id);
  }

  // IS IN CART

  isInCart(book: Book): boolean {
    return this.cartBookIds.has(book.id);
  }

  // CART PROCESSING

  isCartProcessing(bookId: number): boolean {
    return this.processingCartIds.has(bookId);
  }

  // WISHLIST PROCESSING

  isWishlistProcessing(bookId: number): boolean {
    return this.processingWishlistIds.has(bookId);
  }

  // RATING

  getRating(book: Book): number {
    const rating = Number(book.rating) || 0;

    return Math.min(5, Math.max(0, rating));
  }

  // FULL STARS

  getFullStars(book: Book): number[] {
    const rating = Math.floor(this.getRating(book));

    return Array.from(
      {
        length: rating,
      },
      (_, index) => index,
    );
  }

  // EMPTY STARS

  getEmptyStars(book: Book): number[] {
    const rating = Math.floor(this.getRating(book));

    return Array.from(
      {
        length: Math.max(0, 5 - rating),
      },
      (_, index) => index,
    );
  }

  // TOAST

  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastMessage = message;

    this.toastType = type;

    this.showToast = true;

    this.cdr.detectChanges();

    this.toastTimer = setTimeout(() => {
      this.closeToast();
    }, 3500);
  }

  // CLOSE TOAST

  closeToast(): void {
    this.showToast = false;

    this.toastMessage = '';

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);

      this.toastTimer = undefined;
    }

    this.cdr.detectChanges();
  }

  // BOOK IMAGE ERROR

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.onerror = null;

    image.src = this.placeholderImage;
  }

  // CATEGORY IMAGE ERROR

  onCategoryImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.onerror = null;

    image.src = this.categoryPlaceholderImage;
  }

  // TRACK BOOK

  trackByBook(_index: number, book: Book): number {
    return book.id;
  }

  // TRACK CATEGORY

  trackByCategory(_index: number, category: Category): number {
    return category.id;
  }
}
