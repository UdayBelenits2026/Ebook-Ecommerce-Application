import { createAction, props } from '@ngrx/store';
import { WishlistResponse } from '../../interface/wishlist-interface';

export const loadWishlist = createAction('[Wishlist] Load Wishlist');
export const loadWishlistSuccess = createAction(
  '[Wishlist API] Load Wishlist Success',
  props<{ response: WishlistResponse }>()
);
export const loadWishlistFailure = createAction(
  '[Wishlist API] Load Wishlist Failure',
  props<{ error: string }>()
);

export const addToWishlist = createAction(
  '[Wishlist] Add To Wishlist',
  props<{ bookId: number }>()
);
export const removeFromWishlist = createAction(
  '[Wishlist] Remove From Wishlist',
  props<{ bookId: number }>()
);
export const moveToCart = createAction(
  '[Wishlist] Move To Cart',
  props<{ bookId: number }>()
);
export const clearWishlist = createAction('[Wishlist] Clear Wishlist');
