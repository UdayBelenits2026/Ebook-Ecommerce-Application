import { createReducer, on } from '@ngrx/store';

import {
  BooksState,
  initialBooksState
} from './books.state';

import {
  LoadBooks,
  LoadBooksSuccess,
  LoadBooksFailure
} from './books.actions';


export const booksReducer = createReducer(

  initialBooksState,

  on(
    LoadBooks,

    (state, action) => ({

      ...state,

      loading: true,

      error: null,

      page: action.page,

      limit: action.limit,

      search: action.search,

      categoryId: action.categoryId,

      minPrice: action.minPrice,

      maxPrice: action.maxPrice,

      sortBy: action.sortBy

    })

  ),
  on(
    LoadBooksSuccess,

    (state, action) => ({

      ...state,

      loading: false,

      books: action.response.items,

      total: action.response.total,

      page: action.response.page,

      limit: action.response.limit,

      error: null

    })

  ),

  on(
    LoadBooksFailure,

    (state, action) => ({

      ...state,

      loading: false,

      error: action.error

    })

  )

);