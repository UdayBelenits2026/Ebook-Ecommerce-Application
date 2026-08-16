import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CartService } from '../../services/cart-service';
import * as CartActions from './cart.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() =>
        this.cartService.getCart().pipe(
          map((response) => CartActions.loadCartSuccess({ response })),
          catchError((error) =>
            of(
              CartActions.loadCartFailure({
                error: error?.error?.message ?? error?.error?.detail ?? 'Failed to load cart.'
              })
            )
          )
        )
      )
    )
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      mergeMap(({ bookId, quantity }) =>
        this.cartService.addToCart({ book_id: bookId, quantity }).pipe(
          map(() => CartActions.loadCart()),
          catchError((error) =>
            of(
              CartActions.addToCartFailure({
                error: error?.error?.message ?? 'Failed to add to cart.'
              })
            )
          )
        )
      )
    )
  );

  increaseItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.increaseCartItem),
      mergeMap(({ bookId }) =>
        this.cartService.increaseQuantity(bookId).pipe(
          map(() => CartActions.loadCart()),
          catchError((error) =>
            of(CartActions.loadCartFailure({ error: error?.error?.message ?? 'Failed to increase item.' }))
          )
        )
      )
    )
  );

  decreaseItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.decreaseCartItem),
      mergeMap(({ bookId }) =>
        this.cartService.decreaseQuantity(bookId).pipe(
          map(() => CartActions.loadCart()),
          catchError((error) =>
            of(CartActions.loadCartFailure({ error: error?.error?.message ?? 'Failed to decrease item.' }))
          )
        )
      )
    )
  );

  updateQuantity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartQuantity),
      mergeMap(({ bookId, quantity }) =>
        this.cartService.updateQuantity({ book_id: bookId, quantity }).pipe(
          map(() => CartActions.loadCart()),
          catchError((error) =>
            of(CartActions.loadCartFailure({ error: error?.error?.message ?? 'Failed to update quantity.' }))
          )
        )
      )
    )
  );

  removeItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeFromCart),
      mergeMap(({ bookId }) =>
        this.cartService.removeFromCart(bookId).pipe(
          map(() => CartActions.loadCart()),
          catchError((error) =>
            of(CartActions.loadCartFailure({ error: error?.error?.message ?? 'Failed to remove item.' }))
          )
        )
      )
    )
  );

  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.clearCart),
      mergeMap(() =>
        this.cartService.clearCartApi().pipe(
          map(() => CartActions.clearCartSuccess()),
          catchError((error) =>
            of(CartActions.loadCartFailure({ error: error?.error?.message ?? 'Failed to clear cart.' }))
          )
        )
      )
    )
  );
}
