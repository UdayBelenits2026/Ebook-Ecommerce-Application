import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoriesState } from './categories.state';

export const selectCategoriesState = createFeatureSelector<CategoriesState>('categories');

export const selectCategories = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.categories
);

export const selectCategoriesLoading = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.loading
);

export const selectCategoriesError = createSelector(
  selectCategoriesState,
  (state: CategoriesState) => state.error
);
