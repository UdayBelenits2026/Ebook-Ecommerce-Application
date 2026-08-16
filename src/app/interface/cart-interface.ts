// src/app/interface/cart-interface.ts

// CART ITEM

export interface CartItem {
  id: number;

  cart_id: number;

  book_id: number;

  quantity: number;

  title: string;

  author: string;

  price: number;

  image: string | null;

  stock: number;

  category_name: string | null;

  rating: number;

  subtotal: number;

  in_wishlist: boolean;
}

// CART DATA
// Returned inside GET /cart -> data

export interface CartData {
  items: CartItem[];

  subtotal: number;

  shipping: number;

  grand_total: number;

  cart_count: number;
}

// GET /cart RESPONSE

export interface CartResponse {
  success: boolean;

  message?: string;

  data: CartData;
}

// ADD TO CART
// POST /cart/add

export interface AddToCartRequest {
  book_id: number;

  quantity: number;
}

// UPDATE CART
// PATCH /cart/update

export interface UpdateCartRequest {
  book_id: number;

  quantity: number;
}

// GENERIC API RESPONSE
// Used by add/increase/decrease/remove/clear

export interface CartActionResponse {
  success: boolean;

  message?: string;

  data?: unknown;
}

// GET /cart/count

export interface CartCountData {
  cart_count: number;
}

export interface CartCountResponse {
  success: boolean;

  message?: string;

  data: CartCountData;
}
