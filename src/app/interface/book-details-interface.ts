export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface BookDetails {

  id: number;

  title: string;

  author: string;

  category_id: number;

  category_name: string;

  publisher: string;

  isbn: string;

  language: string;

  pages: number;

  price: number;

  stock: number;

  description: string;

  image: string;

  rating: number;

  review_count: number;

  created_at: string;

  updated_at: string;

  in_cart: boolean;

  in_wishlist: boolean;

}