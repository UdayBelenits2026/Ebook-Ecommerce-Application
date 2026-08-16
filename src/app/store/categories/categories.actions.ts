import { createAction, props } from '@ngrx/store';
import { Category, CreateCategoryDto } from '../../interface/category-interface';

export const loadCategories = createAction('[Categories] Load Categories');
export const loadCategoriesSuccess = createAction(
  '[Categories API] Load Categories Success',
  props<{ categories: Category[] }>()
);
export const loadCategoriesFailure = createAction(
  '[Categories API] Load Categories Failure',
  props<{ error: string }>()
);

export const createCategory = createAction(
  '[Categories] Create Category',
  props<{ data: CreateCategoryDto; image?: File }>()
);
export const createCategorySuccess = createAction('[Categories API] Create Category Success');
export const createCategoryFailure = createAction(
  '[Categories API] Create Category Failure',
  props<{ error: string }>()
);

export const deleteCategory = createAction(
  '[Categories] Delete Category',
  props<{ id: number }>()
);
export const deleteCategorySuccess = createAction('[Categories API] Delete Category Success');
export const deleteCategoryFailure = createAction(
  '[Categories API] Delete Category Failure',
  props<{ error: string }>()
);
