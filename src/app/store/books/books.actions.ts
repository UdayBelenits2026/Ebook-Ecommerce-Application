import { createAction, props } from '@ngrx/store';

import {
  BookResponse
} from '../../interface/bookinterface';

export const LoadBooks = createAction(

  '[Books Page] Load Books',

  props<{
    page: number;
    limit: number;
    search: string;
    categoryId: number | null;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: string;
  }>()

);
export const LoadBooksSuccess = createAction(

  '[Books API] Load Books Success',

  props<{
    response: BookResponse;
  }>()

);

export const LoadBooksFailure = createAction(

  '[Books API] Load Books Failure',

  props<{
    error: string;
  }>()

);