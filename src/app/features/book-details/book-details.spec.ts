import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { BookDetailsComponent } from './book-details';

import { BookDetailsService } from '../../services/book-details-service';
import { BookService } from '../../services/bookservices';
import { CartService } from '../../services/cart-service';
import { WishlistService } from '../../services/wishlist-service';
import { AuthService } from '../../services/auth-services';

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;

  let bookDetailsSpy: jasmine.SpyObj<BookDetailsService>;
  let bookSpy: jasmine.SpyObj<BookService>;
  let cartSpy: jasmine.SpyObj<CartService>;
  let wishlistSpy: jasmine.SpyObj<WishlistService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // ============================================================
    // SERVICE SPIES
    // ============================================================

    bookDetailsSpy = jasmine.createSpyObj('BookDetailsService', ['getBook']);

    bookSpy = jasmine.createSpyObj('BookService', ['getBooks']);

    cartSpy = jasmine.createSpyObj('CartService', ['addToCart', 'refreshCartCount']);

    wishlistSpy = jasmine.createSpyObj('WishlistService', ['addToWishlist', 'removeFromWishlist']);

    authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // ============================================================
    // DEFAULT MOCK RESPONSES
    // ============================================================

    /*
     * IMPORTANT:
     *
     * Do NOT use:
     *
     * of({})
     *
     * because BookDetailsComponent expects a valid book object
     * from the API response.
     *
     * The component accesses properties such as:
     *
     * response.data.image
     * response.data.title
     * response.data.price
     *
     * Therefore provide a complete default book.
     */

    const defaultBook = {
      id: 1,

      title: 'Test Book',

      author: 'Test Author',

      image: '/media/test-book.jpg',

      price: 100,

      stock: 5,

      description: 'Test book description',

      category_id: 1,

      category_name: 'Fiction',

      publisher: 'Test Publisher',

      isbn: '1234567890',

      language: 'English',

      pages: 100,

      rating: 3,

      reviews: [],
    };

    /*
     * IMPORTANT:
     *
     * If your BookDetailsService returns:
     *
     * {
     *   data: book
     * }
     *
     * then use this structure.
     */

    bookDetailsSpy.getBook.and.returnValue(
      of({
        data: defaultBook,
      } as any),
    );

    /*
     * BookService default response.
     *
     * Keep it compatible with a paginated books response.
     */

    bookSpy.getBooks.and.returnValue(
      of({
        items: [],

        total: 0,

        page: 1,

        limit: 12,
      } as any),
    );

    // Cart

    cartSpy.addToCart.and.returnValue(
      of({
        success: true,

        message: 'Added to cart',

        data: null,
      } as any),
    );

    // Wishlist add

    wishlistSpy.addToWishlist.and.returnValue(
      of({
        success: true,

        message: 'Added to wishlist',

        data: null,
      } as any),
    );

    // Wishlist remove

    wishlistSpy.removeFromWishlist.and.returnValue(
      of({
        success: true,

        message: 'Removed from wishlist',

        data: null,
      } as any),
    );

    // Auth default

    authSpy.getToken.and.returnValue(null);

    // ============================================================
    // TEST BED
    // ============================================================

    await TestBed.configureTestingModule({
      imports: [BookDetailsComponent],

      providers: [
        // ActivatedRoute

        {
          provide: ActivatedRoute,

          useValue: {
            paramMap: of({
              get: (key: string) => {
                if (key === 'id') {
                  return '1';
                }

                return null;
              },
            }),
          },
        },

        // BookDetailsService

        {
          provide: BookDetailsService,

          useValue: bookDetailsSpy,
        },

        // BookService

        {
          provide: BookService,

          useValue: bookSpy,
        },

        // CartService

        {
          provide: CartService,

          useValue: cartSpy,
        },

        // WishlistService

        {
          provide: WishlistService,

          useValue: wishlistSpy,
        },

        // AuthService

        {
          provide: AuthService,

          useValue: authSpy,
        },

        // Router

        {
          provide: Router,

          useValue: routerSpy,
        },
      ],
    }).compileComponents();

    // ============================================================
    // CREATE COMPONENT
    // ============================================================

    fixture = TestBed.createComponent(BookDetailsComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ============================================================
  // CREATE
  // ============================================================

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  // IMAGE
  // ============================================================

  it('should return default image when book image is missing', () => {
    component.book = null;

    expect(component.imageUrl).toContain('no-book.png');
  });

  it('should return book image when book exists', () => {
    component.book = {
      id: 1,

      title: 'Test Book',

      image: '/media/book.jpg',
    } as any;

    expect(component.imageUrl).toContain('/media/book.jpg');
  });

  // ============================================================
  // PRICE
  // ============================================================

  it('formatPrice returns formatted price', () => {
    expect(component.formatPrice(100)).toBe('₹100.00');
  });

  it('formatPrice returns zero for null', () => {
    expect(component.formatPrice(null)).toBe('₹0');
  });

  it('formatPrice returns zero for undefined', () => {
    expect(component.formatPrice(undefined)).toBe('₹0');
  });

  // ============================================================
  // STARS
  // ============================================================

  it('getStars returns correct star array', () => {
    expect(component.getStars(3)).toEqual([true, true, true, false, false]);
  });

  it('getStars returns all false for zero rating', () => {
    expect(component.getStars(0)).toEqual([false, false, false, false, false]);
  });

  it('getStars returns all true for five rating', () => {
    expect(component.getStars(5)).toEqual([true, true, true, true, true]);
  });

  // ============================================================
  // INCREASE QUANTITY
  // ============================================================

  it('increase quantity should increase when stock is available', () => {
    component.book = {
      id: 1,

      stock: 5,
    } as any;

    component.quantity = 1;

    component.increaseQuantity();

    expect(component.quantity).toBe(2);
  });

  it('increase quantity should not exceed stock', () => {
    component.book = {
      id: 1,

      stock: 2,
    } as any;

    component.quantity = 2;

    component.increaseQuantity();

    expect(component.quantity).toBe(2);
  });

  // ============================================================
  // DECREASE QUANTITY
  // ============================================================

  it('decrease quantity should not go below one', () => {
    component.quantity = 1;

    component.decreaseQuantity();

    expect(component.quantity).toBe(1);
  });

  it('decrease quantity should reduce quantity when greater than one', () => {
    component.quantity = 3;

    component.decreaseQuantity();

    expect(component.quantity).toBe(2);
  });

  // ============================================================
  // TAB
  // ============================================================

  it('changeTab updates selected tab', () => {
    component.changeTab('reviews');

    expect(component.selectedTab).toBe('reviews');
  });

  // ============================================================
  // LOGIN
  // ============================================================

  it('isLoggedIn returns true when token exists', () => {
    authSpy.getToken.and.returnValue('token');

    expect(component.isLoggedIn()).toBeTrue();
  });

  it('isLoggedIn returns false without token', () => {
    authSpy.getToken.and.returnValue(null);

    expect(component.isLoggedIn()).toBeFalse();
  });

  // ============================================================
  // OPEN BOOK
  // ============================================================

  it('openBook navigates correctly', () => {
    component.openBook(10);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/book-details', 10]);
  });

  // ============================================================
  // CONTINUE SHOPPING
  // ============================================================

  it('continue shopping navigates to books', () => {
    component.continueShopping();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/books']);
  });

  // ============================================================
  // CART
  // ============================================================

  it('goToCart navigates to cart', () => {
    component.goToCart();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/cart']);
  });
});
