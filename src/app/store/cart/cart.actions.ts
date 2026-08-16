import { createAction, props } from '@ngrx/store';
import { CartResponse } from '../../interface/cart-interface';

export const loadCart = createAction('[Cart] Load Cart');
export const loadCartSuccess = createAction(
  '[Cart API] Load Cart Success',
  props<{ response: CartResponse }>()
);
export const loadCartFailure = createAction(
  '[Cart API] Load Cart Failure',
  props<{ error: string }>()
);

export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ bookId: number; quantity: number }>()
);
export const addToCartSuccess = createAction('[Cart API] Add To Cart Success');
export const addToCartFailure = createAction(
  '[Cart API] Add To Cart Failure',
  props<{ error: string }>()
);

export const increaseCartItem = createAction(
  '[Cart] Increase Item',
  props<{ bookId: number }>()
);
export const decreaseCartItem = createAction(
  '[Cart] Decrease Item',
  props<{ bookId: number }>()
);
export const updateCartQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ bookId: number; quantity: number }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ bookId: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart');
export const clearCartSuccess = createAction('[Cart API] Clear Cart Success');
