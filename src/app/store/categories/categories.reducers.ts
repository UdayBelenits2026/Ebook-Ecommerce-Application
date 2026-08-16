import { createReducer, on } from '@ngrx/store';
import { initialCategoriesState } from './categories.state';
import * as CategoriesActions from './categories.actions';

export const categoriesReducer = createReducer(
  initialCategoriesState,
  on(CategoriesActions.loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CategoriesActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    loading: false,
    categories,
    error: null
  })),
  on(CategoriesActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(CategoriesActions.createCategory, CategoriesActions.deleteCategory, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CategoriesActions.createCategoryFailure, CategoriesActions.deleteCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
