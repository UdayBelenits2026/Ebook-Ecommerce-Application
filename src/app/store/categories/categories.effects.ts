import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesService } from '../../services/categories-service';
import * as CategoriesActions from './categories.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class CategoriesEffects {
  private actions$ = inject(Actions);
  private categoriesService = inject(CategoriesService);

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.loadCategories),
      switchMap(() =>
        this.categoriesService.getCategories().pipe(
          map((categories) => CategoriesActions.loadCategoriesSuccess({ categories })),
          catchError((error) =>
            of(CategoriesActions.loadCategoriesFailure({
              error: error?.error?.message ?? 'Failed to load categories.'
            }))
          )
        )
      )
    )
  );

  createCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.createCategory),
      mergeMap(({ data, image }) =>
        this.categoriesService.createCategory(data, image).pipe(
          map(() => CategoriesActions.loadCategories()),
          catchError((error) =>
            of(CategoriesActions.createCategoryFailure({
              error: error?.error?.message ?? 'Failed to create category.'
            }))
          )
        )
      )
    )
  );

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.deleteCategory),
      mergeMap(({ id }) =>
        this.categoriesService.deleteCategory(id).pipe(
          map(() => CategoriesActions.loadCategories()),
          catchError((error) =>
            of(CategoriesActions.deleteCategoryFailure({
              error: error?.error?.message ?? 'Failed to delete category.'
            }))
          )
        )
      )
    )
  );
}
