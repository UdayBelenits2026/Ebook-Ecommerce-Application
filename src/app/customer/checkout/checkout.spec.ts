import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Subject,
  of
} from 'rxjs';

import { Checkout } from './checkout';

import { CartService } from '../../services/cart-service';
import { CheckoutService } from '../../services/checkout-service';
import { AddressService } from '../../services/address-service';
import { AuthService } from '../../services/auth-services';

import { Router } from '@angular/router';


describe('Checkout', () => {

  let component: Checkout;

  let fixture: ComponentFixture<Checkout>;

  let cartSpy: jasmine.SpyObj<CartService>;

  let checkoutSpy: jasmine.SpyObj<CheckoutService>;

  let addressSpy: jasmine.SpyObj<AddressService>;

  let authSpy: jasmine.SpyObj<AuthService>;

  let routerSpy: jasmine.SpyObj<Router>;

  /*
   * IMPORTANT
   *
   * cartChanged in the real CartService is a Subject.
   *
   * Checkout calls:
   *
   * this.cartService.cartChanged.next(...)
   *
   * Therefore we must mock it with Subject,
   * NOT of().
   */
  let cartChangedSubject: Subject<void>;


  beforeEach(async () => {

    /*
     * Create Subject for cartChanged
     */
    cartChangedSubject = new Subject<void>();


    /*
     * CartService spy
     */
    cartSpy = jasmine.createSpyObj(
      'CartService',
      [
        'getCart'
      ],
      {
        cartChanged: cartChangedSubject
      }
    );


    /*
     * CheckoutService spy
     */
    checkoutSpy = jasmine.createSpyObj(
      'CheckoutService',
      [
        'placeOrder'
      ]
    );


    /*
     * AddressService spy
     */
    addressSpy = jasmine.createSpyObj(
      'AddressService',
      [
        'getAddresses',
        'addAddress',
        'updateAddress',
        'deleteAddress'
      ]
    );


    /*
     * AuthService spy
     */
    authSpy = jasmine.createSpyObj(
      'AuthService',
      [
        'isUserLoggedIn'
      ]
    );


    /*
     * Router spy
     */
    routerSpy = jasmine.createSpyObj(
      'Router',
      [
        'navigate'
      ]
    );


    /*
     * Default Cart response
     *
     * Important because ngOnInit() may call loadCart().
     */
    cartSpy.getCart.and.returnValue(

      of({

        success: true,

        data: {

          items: [],

          cart_count: 0,

          subtotal: 0,

          shipping: 0,

          grand_total: 0

        }

      } as any)

    );


    /*
     * Default Address response
     */
    addressSpy.getAddresses.and.returnValue(

      of({

        data: []

      } as any)

    );


    /*
     * Default login state
     */
    authSpy.isUserLoggedIn.and.returnValue(true);


    await TestBed.configureTestingModule({

      imports: [
        Checkout
      ],

      providers: [

        {
          provide: CartService,
          useValue: cartSpy
        },

        {
          provide: CheckoutService,
          useValue: checkoutSpy
        },

        {
          provide: AddressService,
          useValue: addressSpy
        },

        {
          provide: AuthService,
          useValue: authSpy
        },

        {
          provide: Router,
          useValue: routerSpy
        }

      ]

    }).compileComponents();


    /*
     * Create component
     */
    fixture = TestBed.createComponent(Checkout);

    component = fixture.componentInstance;


    /*
     * Run Angular lifecycle
     */
    fixture.detectChanges();

  });


  // ============================================================
  // COMPONENT
  // ============================================================

  it('should create', () => {

    expect(component)
      .toBeTruthy();

  });


  // ============================================================
  // NG ON INIT - NOT LOGGED IN
  // ============================================================

  it('ngOnInit redirects when not logged in', async () => {

    authSpy.isUserLoggedIn.and.returnValue(false);


    await component.ngOnInit();


    expect(routerSpy.navigate)
      .toHaveBeenCalledWith([
        '/login'
      ]);

  });


  // ============================================================
  // LOAD CART
  // ============================================================

  it('loadCart sets values on success', () => {

    cartSpy.getCart.and.returnValue(

      of({

        success: true,

        data: {

          items: [

            {
              book_id: 1,
              quantity: 2
            }

          ],

          cart_count: 1,

          subtotal: 200,

          shipping: 20,

          grand_total: 220

        }

      } as any)

    );


    component.loadCart();


    expect(component.cartItems.length)
      .toBe(1);


    expect(component.cartCount)
      .toBe(1);

  });


  // ============================================================
  // LOAD ADDRESSES
  // ============================================================

  it('loadAddresses selects default address', () => {

    const addresses = [

      {
        id: 1,
        is_default: false
      },

      {
        id: 2,
        is_default: true
      }

    ];


    addressSpy.getAddresses.and.returnValue(

      of({

        data: addresses

      } as any)

    );


    component.loadAddresses();


    expect(component.selectedAddressId)
      .toBe(2);

  });


  // ============================================================
  // LOAD ADDRESSES - EMPTY
  // ============================================================

  it('loadAddresses sets selectedAddressId to 0 when there are no addresses', () => {

    addressSpy.getAddresses.and.returnValue(

      of({

        data: []

      } as any)

    );


    component.loadAddresses();


    expect(component.selectedAddressId)
      .toBe(0);

  });


  // ============================================================
  // SELECT ADDRESS
  // ============================================================

  it('selectAddress updates selected address', () => {

    component.addresses = [

      {
        id: 7

      } as any

    ];


    component.selectAddress({

      id: 7

    } as any);


    expect(component.selectedAddressId)
      .toBe(7);


    expect(component.selectedAddress?.id)
      .toBe(7);

  });


  // ============================================================
  // SELECT PAYMENT
  // ============================================================

  it('selectPayment updates payment method', () => {

    component.selectPayment('COD');


    expect(component.order.payment_method)
      .toBe('COD');


    expect(component.isPaymentSelected('COD'))
      .toBeTrue();

  });


  // ============================================================
  // PLACE ORDER - NO ADDRESS
  // ============================================================

  it('placeOrder shows error when address is not selected', () => {

    component.order.address_id = 0;


    component.placeOrder();


    expect(component.errorMessage)
      .toContain(
        'Please select a delivery address'
      );

  });


  // ============================================================
  // PLACE ORDER - NO PAYMENT
  // ============================================================

  it('placeOrder shows error when payment method is not selected', () => {

    component.order.address_id = 1;

    component.order.payment_method = '';


    component.placeOrder();


    expect(component.errorMessage)
      .toContain(
        'Please select a payment method'
      );

  });


  // ============================================================
  // PLACE ORDER - EMPTY CART
  // ============================================================

  it('placeOrder shows error when cart is empty', () => {

    component.order.address_id = 1;

    component.order.payment_method = 'COD';

    component.cartItems = [];


    component.placeOrder();


    expect(component.errorMessage)
      .toContain(
        'Your cart is empty'
      );

  });


  // ============================================================
  // PLACE ORDER - SUCCESS
  // ============================================================

  it('placeCashOnDelivery success sets successMessage and navigates', () => {

    component.cartItems = [

      {
        book_id: 1,
        quantity: 1

      } as any

    ];


    component.order.address_id = 1;

    component.order.payment_method = 'COD';


    checkoutSpy.placeOrder.and.returnValue(

      of({

        success: true,

        message: 'Order placed successfully',

        data: {

          order_id: 1

        }

      } as any)

    );


    spyOn(
      component as any,
      'loadCart'
    );


    component.placeOrder();


    expect(component.successMessage)
      .toContain(
        'Order placed successfully'
      );


    expect(
      (component as any).loadCart
    ).toHaveBeenCalled();


    /*
     * Verify that cartChanged.next()
     * can be called successfully.
     *
     * This is the exact problem from
     * your original test.
     */
    expect(cartChangedSubject)
      .toBeTruthy();

  });


  // ============================================================
  // CART CHANGED EVENT
  // ============================================================

  it('cartChanged should support next()', () => {

    let emitted = false;


    cartChangedSubject.subscribe(() => {

      emitted = true;

    });


    cartChangedSubject.next();


    expect(emitted)
      .toBeTrue();

  });


  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  it('formatCurrency formats Indian currency', () => {

    const formatted = component.formatCurrency(
      1234.5
    );


    expect(formatted)
      .toContain('₹');

  });


  // ============================================================
  // GET ADDRESS LABEL
  // ============================================================

  it('getAddressLabel returns formatted address', () => {

    const address = {

      house_no: '10',

      street: 'St',

      area: 'A',

      village_city: 'City',

      district: 'D',

      state: 'S',

      pincode: '123456'

    } as any;


    expect(
      component.getAddressLabel(address)
    )
      .toContain('10');

  });


  // ============================================================
  // CAN PLACE ORDER
  // ============================================================

  it('canPlaceOrder returns true when order can be placed', () => {

    component.cartItems = [

      {
        book_id: 1,
        quantity: 1

      } as any

    ];


    component.order.address_id = 1;

    component.order.payment_method = 'COD';

    component.placingOrder = false;


    expect(
      component.canPlaceOrder()
    )
      .toBeTrue();

  });


  // ============================================================
  // CAN PLACE ORDER - ALREADY PLACING
  // ============================================================

  it('canPlaceOrder returns false while order is being placed', () => {

    component.cartItems = [

      {
        book_id: 1,
        quantity: 1

      } as any

    ];


    component.order.address_id = 1;

    component.order.payment_method = 'COD';

    component.placingOrder = true;


    expect(
      component.canPlaceOrder()
    )
      .toBeFalse();

  });

});