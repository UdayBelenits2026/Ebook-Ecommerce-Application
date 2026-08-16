export interface Book {
  id: number;

  title: string;
  author: string;

  category_id: number | null;
  category_name: string | null;

  publisher: string | null;
  isbn: string | null;
  language: string | null;

  pages: number | null;

  price: number;
  stock: number;

  description: string | null;
  image: string | null;

  rating: number;
  review_count: number;

  in_wishlist: boolean;
  in_cart: boolean;

  created_at: string | null;
  updated_at: string | null;
}

export interface BookResponse {
  items: Book[];
  total: number;
  page: number;
  limit: number;
}
