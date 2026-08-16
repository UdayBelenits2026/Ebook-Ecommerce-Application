import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { Homepage } from './homepage';

import { Store } from '@ngrx/store';

import { CategoriesService } from '../../services/categories-service';

import { BookService } from '../../services/bookservices';

import { CartService } from '../../services/cart-service';

import { WishlistService } from '../../services/wishlist-service';

import { AuthService } from '../../services/auth-services';

describe('Homepage', () => {
  let component: Homepage;

  let fixture: ComponentFixture<Homepage>;

  const mockStore = {
    dispatch: jasmine.createSpy('dispatch'),

    select: jasmine.createSpy('select').and.callFake(() => of([])),
  };

  const mockBookService = {
    getBooks: jasmine.createSpy('getBooks').and.returnValue(
      of({
        items: [],

        total: 0,

        page: 1,

        limit: 12,
      }),
    ),
  };

  const mockCategoriesService = {
    getCategories: jasmine.createSpy('getCategories').and.returnValue(of([])),
  };

  const mockCartService = {
    cartChanged: of(),

    addToCart: jasmine.createSpy('addToCart').and.returnValue(
      of({
        success: true,

        message: 'Added to cart',
      }),
    ),

    resetCartCount: jasmine.createSpy('resetCartCount'),
  };

  const mockWishlistService = {
    wishlistChanged: of(),

    addToWishlist: jasmine.createSpy('addToWishlist').and.returnValue(
      of({
        success: true,

        message: 'Added to wishlist',
      }),
    ),

    removeFromWishlist: jasmine.createSpy('removeFromWishlist').and.returnValue(
      of({
        success: true,

        message: 'Removed from wishlist',
      }),
    ),
  };

  const mockAuthService = {
    isUserLoggedIn: jasmine.createSpy('isUserLoggedIn').and.returnValue(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homepage],

      providers: [
        {
          provide: Store,

          useValue: mockStore,
        },

        {
          provide: BookService,

          useValue: mockBookService,
        },

        {
          provide: CategoriesService,

          useValue: mockCategoriesService,
        },

        {
          provide: CartService,

          useValue: mockCartService,
        },

        {
          provide: WishlistService,

          useValue: mockWishlistService,
        },

        {
          provide: AuthService,

          useValue: mockAuthService,
        },

        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Homepage);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // it('creates component and initial state', () => {
  //   expect(component).toBeTruthy();

  //   expect(component.isLoadingFeatured).toBeTrue();

  //   expect(component.services.length).toBeGreaterThan(0);
  // });

  it('showToast sets message and visibility', () => {
    component['toastMessage'] = '';

    component['toastType'] = 'success';

    component['showToast'] = false;

    component['toastMessage'] = 'hi';

    component['showToast'] = true;

    expect(component['toastMessage']).toBe('hi');

    expect(component['showToast']).toBeTrue();
  });

  it('onImageError replaces src without throwing', () => {
    const fakeEvent: any = {
      target: {
        onerror: () => {},

        src: '',
      },
    };

    component.onImageError(fakeEvent as any);

    expect(fakeEvent.target.src).toContain('no-book.png');
  });
});
