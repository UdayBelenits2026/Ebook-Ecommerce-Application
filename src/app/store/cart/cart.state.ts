import { CartItem } from '../../interface/cart-interface';

export interface CartState {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  grandTotal: number;
  loading: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  items: [],
  cartCount: 0,
  subtotal: 0,
  shipping: 0,
  grandTotal: 0,
  loading: false,
  error: null
};
