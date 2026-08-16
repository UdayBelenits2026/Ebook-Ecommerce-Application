import { Component, ChangeDetectorRef, OnInit, ElementRef, ViewChild, inject } from '@angular/core';

import { ReviewsComponent } from '../../customer/reviews/reviews';

import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { finalize } from 'rxjs';

import { BookReviews } from '../../customer/book-review/book-review';

import { BookService } from '../../services/bookservices';

import { Book, BookResponse } from '../../interface/bookinterface';

import { BookDetailsService } from '../../services/book-details-service';

import { BookDetails } from '../../interface/book-details-interface';

import { CartService } from '../../services/cart-service';

import { WishlistService } from '../../services/wishlist-service';

import { CheckoutService } from '../../services/checkout-service';

import { AuthService } from '../../services/auth-services';

@Component({
  selector: 'app-book-details',

  standalone: true,

  imports: [CommonModule, RouterModule, BookReviews],

  templateUrl: './book-details.html',

  styleUrls: ['./book-details.css'],
})
export class BookDetailsComponent implements OnInit {
  // DEPENDENCY INJECTION

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly cdr = inject(ChangeDetectorRef);

  private readonly bookService = inject(BookService);

  private readonly bookDetailsService = inject(BookDetailsService);

  private readonly cartService = inject(CartService);

  private readonly wishlistService = inject(WishlistService);

  private readonly checkoutService = inject(CheckoutService);

  private readonly authService = inject(AuthService);

  // RELATED BOOKS SCROLLER

  @ViewChild('relatedBooksScroller')
  relatedBooksScroller!: ElementRef<HTMLDivElement>;

  // API URL

  readonly apiUrl = 'http://127.0.0.1:8000';

  // PAGE STATE

  loading = false;

  error = '';

  // BOOK

  book: BookDetails | null = null;

  relatedBooks: Book[] = [];

  // IMAGE GALLERY

  selectedImage = '';

  thumbnails: string[] = [];

  // PRODUCT

  quantity = 1;

  selectedTab = 'description';

  // RATING

  readonly stars = [1, 2, 3, 4, 5];

  // LIFECYCLE

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = Number(params.get('id'));

        if (!id || isNaN(id)) {
          this.error = 'Invalid Book ID';

          return;
        }

        this.loadBook(id);
      },
    });
  }

  // LOAD BOOK

  loadBook(id: number): void {
    this.loading = true;

    this.error = '';

    this.bookDetailsService
      .getBook(id)

      .pipe(
        finalize(() => {
          this.loading = false;

          this.cdr.detectChanges();
        }),
      )

      .subscribe({
        next: (response) => {
          this.book = response.data;

          if (this.book.image) {
            if (this.book.image.startsWith('http')) {
              this.selectedImage = this.book.image;
            } else {
              this.selectedImage = `${this.apiUrl}/${this.book.image}`;
            }

            this.thumbnails = [this.selectedImage];
          }

          // Load related books

          this.loadRelatedBooks();

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);

          this.error = 'Unable to load book details.';
        },
      });
  }

  // LOAD RELATED BOOKS

  loadRelatedBooks(): void {
    if (!this.book) {
      return;
    }

    this.bookService
      .getBooks(1, 8, '', this.book.category_id ?? undefined)

      .subscribe({
        next: (response: BookResponse) => {
          this.relatedBooks = response.items.filter((book) => book.id !== this.book?.id);

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Failed to load related books', err);
        },
      });
  }

  // RELATED BOOKS SCROLL

  scrollRelatedBooks(direction: 'left' | 'right'): void {
    if (!this.relatedBooksScroller) {
      return;
    }

    const container = this.relatedBooksScroller.nativeElement;

    const firstCard = container.querySelector('.product-card') as HTMLElement | null;

    if (!firstCard) {
      return;
    }

    const cardWidth = firstCard.offsetWidth;

    const gap = 24;

    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,

      behavior: 'smooth',
    });
  }

  // MAIN IMAGE

  get imageUrl(): string {
    if (!this.book?.image) {
      return 'assets/images/no-book.png';
    }

    if (this.book.image.startsWith('http://') || this.book.image.startsWith('https://')) {
      return this.book.image;
    }

    return `${this.apiUrl}/${this.book.image}`;
  }

  // SELECT IMAGE

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  // QUANTITY

  increaseQuantity(): void {
    if (!this.book) {
      return;
    }

    if (this.quantity < this.book.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // PRODUCT TABS

  changeTab(tab: string): void {
    this.selectedTab = tab;
  }

  // STAR ARRAY

  getStars(rating: number): boolean[] {
    return this.stars.map((star) => star <= Math.round(rating));
  }

  // FORMAT RATING
  // Example: 4.166666 -> 4.2 and 4.12 -> 4.1
  formatRating(rating: number | null | undefined): string {
    if (rating === null || rating === undefined || Number.isNaN(Number(rating))) {
      return '0.0';
    }

    return Number(rating).toFixed(1);
  }

  // CATEGORY NAME

  get categoryName(): string {
    return this.book?.category_name ?? 'Unknown Category';
  }

  // STOCK STATUS

  get stockStatus(): string {
    if (!this.book) {
      return '';
    }

    if (this.book.stock <= 0) {
      return 'Out of Stock';
    }

    if (this.book.stock <= 5) {
      return `Only ${this.book.stock} left`;
    }

    return 'In Stock';
  }

  // CHECK LOGIN

  isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  // GO TO ANOTHER BOOK

  openBook(id: number): void {
    this.router.navigate(['/book-details', id]);
  }

  // GO BACK

  goBack(): void {
    window.history.back();
  }

  // ADD TO CART

  addToCart(): void {
    if (!this.book) {
      return;
    }

    if (!this.isLoggedIn()) {
      alert('Please login to continue.');

      this.router.navigate(['/login']);

      return;
    }

    this.cartService
      .addToCart({
        book_id: this.book.id,

        quantity: this.quantity,
      })

      .subscribe({
        next: () => {
          this.book!.in_cart = true;

          this.cartService.refreshCartCount();

          alert('Book added to cart successfully.');

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);

          alert('Unable to add book to cart.');
        },
      });
  }

  // TOGGLE WISHLIST

  toggleWishlist(): void {
    if (!this.book) {
      return;
    }

    if (!this.isLoggedIn()) {
      alert('Please login to continue.');

      this.router.navigate(['/login']);

      return;
    }

    if (this.book.in_wishlist) {
      this.wishlistService
        .removeFromWishlist(this.book.id)

        .subscribe({
          next: () => {
            this.book!.in_wishlist = false;

            this.cdr.detectChanges();
          },

          error: (err) => {
            console.error(err);

            alert('Unable to remove from wishlist.');
          },
        });
    } else {
      this.wishlistService
        .addToWishlist(this.book.id)

        .subscribe({
          next: () => {
            this.book!.in_wishlist = true;

            this.cdr.detectChanges();
          },

          error: (err) => {
            console.error(err);

            alert('Unable to add to wishlist.');
          },
        });
    }
  }

  // BUY NOW

  buyNow(): void {
    if (!this.book) {
      return;
    }

    if (!this.isLoggedIn()) {
      alert('Please login to continue.');

      this.router.navigate(['/login']);

      return;
    }

    if (this.book.in_cart) {
      this.router.navigate(['/checkout']);

      return;
    }

    this.cartService
      .addToCart({
        book_id: this.book.id,

        quantity: this.quantity,
      })

      .subscribe({
        next: () => {
          this.book!.in_cart = true;

          this.cartService.refreshCartCount();

          this.router.navigate(['/checkout']);
        },

        error: (err) => {
          console.error(err);

          alert('Unable to proceed to checkout.');
        },
      });
  }

  // BUY RELATED BOOK

  buyRelatedBook(book: Book): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);

      return;
    }

    this.cartService
      .addToCart({
        book_id: book.id,

        quantity: 1,
      })

      .subscribe({
        next: () => {
          this.cartService.refreshCartCount();

          this.router.navigate(['/checkout']);
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  // ADD RELATED BOOK TO CART

  addRelatedBookToCart(book: Book): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);

      return;
    }

    this.cartService
      .addToCart({
        book_id: book.id,

        quantity: 1,
      })

      .subscribe({
        next: () => {
          book.in_cart = true;

          this.cartService.refreshCartCount();

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  // TOGGLE RELATED BOOK WISHLIST

  toggleRelatedWishlist(book: Book): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);

      return;
    }

    if (book.in_wishlist) {
      this.wishlistService
        .removeFromWishlist(book.id)

        .subscribe({
          next: () => {
            book.in_wishlist = false;

            this.cdr.detectChanges();
          },
        });
    } else {
      this.wishlistService
        .addToWishlist(book.id)

        .subscribe({
          next: () => {
            book.in_wishlist = true;

            this.cdr.detectChanges();
          },
        });
    }
  }

  // FORMAT PRICE

  formatPrice(price: number | null | undefined): string {
    if (price === null || price === undefined) {
      return '₹0';
    }

    return `₹${Number(price).toFixed(2)}`;
  }

  // IMAGE ERROR

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    img.src = 'assets/images/no-book.png';
  }

  // RELATED BOOK IMAGE

  getBookImage(book: Book): string {
    if (!book.image) {
      return 'assets/images/no-book.png';
    }

    if (book.image.startsWith('http://') || book.image.startsWith('https://')) {
      return book.image;
    }

    return `${this.apiUrl}/${book.image}`;
  }

  // BOOK RATING

  getRatingArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  // IS OUT OF STOCK

  isOutOfStock(): boolean {
    if (!this.book) {
      return true;
    }

    return this.book.stock <= 0;
  }

  // CAN INCREASE QUANTITY

  canIncreaseQuantity(): boolean {
    if (!this.book) {
      return false;
    }

    return this.quantity < this.book.stock;
  }

  // RESET QUANTITY

  resetQuantity(): void {
    this.quantity = 1;
  }
  // CONTINUE SHOPPING

  continueShopping(): void {
    this.router.navigate(['/books']);
  }
  // GO TO CART
  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  // SHARE BOOK
  shareBook(): void {
    if (!this.book) {
      return;
    }

    if (navigator.share) {
      navigator.share({
        title: this.book.title,

        text: this.book.description ?? '',

        url: window.location.href,
      });

      return;
    }

    navigator.clipboard
      .writeText(window.location.href)

      .then(() => {
        alert('Book link copied successfully.');
      });
  }

  // REFRESH CURRENT BOOK
  refreshBook(): void {
    if (!this.book) {
      return;
    }

    this.loadBook(this.book.id);
  }
  // TRACK BY BOOK ID
  trackByBookId(index: number, item: Book): number {
    return item.id;
  }
}