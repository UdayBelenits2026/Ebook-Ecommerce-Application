import {
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import {
  BooksState
} from './books.state';


export const selectBooksState =
  createFeatureSelector<BooksState>('books');



export const selectBooks = createSelector(

  selectBooksState,

  state => state.books

);


export const selectTotalBooks = createSelector(

  selectBooksState,

  state => state.total

);


export const selectCurrentPage = createSelector(

  selectBooksState,

  state => state.page

);


export const selectBooksLimit = createSelector(

  selectBooksState,

  state => state.limit

);


export const selectBooksLoading = createSelector(

  selectBooksState,

  state => state.loading

);


export const selectBooksError = createSelector(

  selectBooksState,

  state => state.error

);


export const selectBooksSearch = createSelector(

  selectBooksState,

  state => state.search

);


export const selectBooksCategoryId = createSelector(

  selectBooksState,

  state => state.categoryId

);


export const selectBooksMinPrice = createSelector(

  selectBooksState,

  state => state.minPrice

);


export const selectBooksMaxPrice = createSelector(

  selectBooksState,

  state => state.maxPrice

);


export const selectBooksSortBy = createSelector(

  selectBooksState,

  state => state.sortBy

);

export const selectHasBooks = createSelector(

  selectBooks,

  books => books.length > 0

);


export const selectTotalPages = createSelector(

  selectBooksState,

  state =>

    Math.max(

      1,

      Math.ceil(
        state.total / state.limit
      )

    )

);