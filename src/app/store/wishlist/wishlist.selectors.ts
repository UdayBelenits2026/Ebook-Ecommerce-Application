import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from './wishlist.state';

export const selectWishlistState = createFeatureSelector<WishlistState>('wishlist');

export const selectWishlistItems = createSelector(
  selectWishlistState,
  (state: WishlistState) => state.items
);

export const selectWishlistCount = createSelector(
  selectWishlistState,
  (state: WishlistState) => state.wishlistCount
);

export const selectWishlistLoading = createSelector(
  selectWishlistState,
  (state: WishlistState) => state.loading
);

export const selectWishlistError = createSelector(
  selectWishlistState,
  (state: WishlistState) => state.error
);

export const selectWishlistBookIds = createSelector(
  selectWishlistItems,
  (items) => new Set(items.map((i) => i.book_id))
);
