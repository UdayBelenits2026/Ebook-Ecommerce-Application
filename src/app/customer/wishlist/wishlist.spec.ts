import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistComponent as Wishlist } from './wishlist';

import { WishlistService } from '../../services/wishlist-service';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-services';
import { Router } from '@angular/router';

describe('Wishlist', () => {
  let component: Wishlist;
  let fixture: ComponentFixture<Wishlist>;

  let wishlistSpy: jasmine.SpyObj<WishlistService>;
  let cartSpy: jasmine.SpyObj<CartService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    wishlistSpy = jasmine.createSpyObj('WishlistService', [
      'getWishlist',
      'removeFromWishlist',
      'moveToCart',
      'clearWishlist',
    ]);

    cartSpy = jasmine.createSpyObj('CartService', ['refreshCartCount']);

    authSpy = jasmine.createSpyObj('AuthService', ['isUserLoggedIn']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Wishlist],

      providers: [
        {
          provide: WishlistService,
          useValue: wishlistSpy,
        },

        {
          provide: CartService,
          useValue: cartSpy,
        },

        {
          provide: AuthService,
          useValue: authSpy,
        },

        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Wishlist);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ============================================================
  // COMPONENT CREATION
  // ============================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
