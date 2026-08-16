import { Book } from '../../interface/bookinterface';

export interface BooksState {

  books: Book[];

  total: number;

  page: number;

  limit: number;

  search: string;

  categoryId: number | null;

  minPrice: number | null;

  maxPrice: number | null;

  sortBy: string;

  loading: boolean;

  error: string | null;
}


export const initialBooksState: BooksState = {

  books: [],

  total: 0,

  page: 1,

  limit: 12,

  search: '',

  categoryId: null,

  minPrice: null,

  maxPrice: null,

  sortBy: '',

  loading: false,

  error: null

};