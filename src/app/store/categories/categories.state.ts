import { Category } from '../../interface/category-interface';

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export const initialCategoriesState: CategoriesState = {
  categories: [],
  loading: false,
  error: null
};
