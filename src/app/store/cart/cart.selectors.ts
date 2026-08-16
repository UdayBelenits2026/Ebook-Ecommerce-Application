import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items
);

export const selectCartCount = createSelector(
  selectCartState,
  (state: CartState) => state.cartCount
);

export const selectCartSubtotal = createSelector(
  selectCartState,
  (state: CartState) => state.subtotal
);

export const selectCartShipping = createSelector(
  selectCartState,
  (state: CartState) => state.shipping
);

export const selectCartGrandTotal = createSelector(
  selectCartState,
  (state: CartState) => state.grandTotal
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state: CartState) => state.loading
);

export const selectCartError = createSelector(
  selectCartState,
  (state: CartState) => state.error
);

export const selectCartBookIds = createSelector(
  selectCartItems,
  (items) => new Set(items.map((i) => i.book_id))
);
