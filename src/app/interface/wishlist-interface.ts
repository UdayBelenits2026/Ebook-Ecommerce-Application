

export interface WishlistItem {
  id: number;
  book_id: number;

  title: string;
  author: string;

  image: string;

  price: number;

  category_name: string;

  quantity: number;

  stock: number;

  rating: number;

  in_cart: boolean;
}

export interface WishlistData {
  items: WishlistItem[];

  total: number;

  wishlist_count: number;
}

export interface WishlistResponse {
  success: boolean;

  message?: string;

  data: WishlistData;
}