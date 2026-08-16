import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WishlistService } from '../../services/wishlist-service';
import * as WishlistActions from './wishlist.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class WishlistEffects {
  private actions$ = inject(Actions);
  private wishlistService = inject(WishlistService);

  loadWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.loadWishlist),
      switchMap(() =>
        this.wishlistService.getWishlist().pipe(
          map((response) => WishlistActions.loadWishlistSuccess({ response })),
          catchError((error) =>
            of(
              WishlistActions.loadWishlistFailure({
                error: error?.error?.message ?? error?.error?.detail ?? 'Failed to load wishlist.'
              })
            )
          )
        )
      )
    )
  );

  addToWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.addToWishlist),
      mergeMap(({ bookId }) =>
        this.wishlistService.addToWishlist(bookId).pipe(
          map(() => WishlistActions.loadWishlist()),
          catchError((error) =>
            of(WishlistActions.loadWishlistFailure({ error: error?.error?.message ?? 'Failed to add to wishlist.' }))
          )
        )
      )
    )
  );

  removeFromWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.removeFromWishlist),
      mergeMap(({ bookId }) =>
        this.wishlistService.removeFromWishlist(bookId).pipe(
          map(() => WishlistActions.loadWishlist()),
          catchError((error) =>
            of(WishlistActions.loadWishlistFailure({ error: error?.error?.message ?? 'Failed to remove from wishlist.' }))
          )
        )
      )
    )
  );

  moveToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.moveToCart),
      mergeMap(({ bookId }) =>
        this.wishlistService.moveToCart(bookId).pipe(
          map(() => WishlistActions.loadWishlist()),
          catchError((error) =>
            of(WishlistActions.loadWishlistFailure({ error: error?.error?.message ?? 'Failed to move to cart.' }))
          )
        )
      )
    )
  );

  clearWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.clearWishlist),
      mergeMap(() =>
        this.wishlistService.clearWishlist().pipe(
          map(() => WishlistActions.loadWishlist()),
          catchError((error) =>
            of(WishlistActions.loadWishlistFailure({ error: error?.error?.message ?? 'Failed to clear wishlist.' }))
          )
        )
      )
    )
  );
}
