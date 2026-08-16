import { createReducer, on } from '@ngrx/store';
import { initialCartState } from './cart.state';
import * as CartActions from './cart.actions';

export const cartReducer = createReducer(
  initialCartState,
  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CartActions.loadCartSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    items: response.data.items,
    cartCount: response.data.cart_count,
    subtotal: response.data.subtotal,
    shipping: response.data.shipping,
    grandTotal: response.data.grand_total,
    error: null
  })),
  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CartActions.clearCartSuccess, (state) => ({
    ...state,
    items: [],
    cartCount: 0,
    subtotal: 0,
    shipping: 0,
    grandTotal: 0,
    loading: false,
    error: null
  }))
);
