import { createReducer, on } from '@ngrx/store';
import { initialWishlistState } from './wishlist.state';
import * as WishlistActions from './wishlist.actions';

export const wishlistReducer = createReducer(
  initialWishlistState,
  on(WishlistActions.loadWishlist, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(WishlistActions.loadWishlistSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    items: response.data.items,
    wishlistCount: response.data.wishlist_count,
    error: null
  })),
  on(WishlistActions.loadWishlistFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
