import { Injectable, inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap } from 'rxjs';

import { BookService } from '../../services/bookservices';

import { LoadBooks, LoadBooksSuccess, LoadBooksFailure } from './books.actions';

@Injectable()
export class BooksEffects {
  private readonly actions$ = inject(Actions);

  private readonly bookService = inject(BookService);

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadBooks),

      switchMap((action) =>
        this.bookService
          .getBooks(
            action.page,

            action.limit,

            action.search,

            action.categoryId,

            action.minPrice,

            action.maxPrice,

            action.sortBy,
          )
          .pipe(
            map((response) =>
              LoadBooksSuccess({
                response,
              }),
            ),

            catchError((error) => {
              console.error('LOAD BOOKS ERROR:', error);

              const message =
                error?.error?.message ?? error?.error?.detail ?? 'Unable to load books.';

              return of(
                LoadBooksFailure({
                  error: message,
                }),
              );
            }),
          ),
      ),
    ),
  );
}
