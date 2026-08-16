import { Cart } from './cart';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { cartReducer } from '../../store/cart/cart.reducers';

describe('Cart', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Cart
      ],
      providers: [
        provideRouter([]),

        provideStore({
          cart: cartReducer
        }),

        provideEffects()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cart);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});