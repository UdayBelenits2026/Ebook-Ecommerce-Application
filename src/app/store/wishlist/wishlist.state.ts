import { WishlistItem } from '../../interface/wishlist-interface';

export interface WishlistState {
  items: WishlistItem[];
  wishlistCount: number;
  loading: boolean;
  error: string | null;
}

export const initialWishlistState: WishlistState = {
  items: [],
  wishlistCount: 0,
  loading: false,
  error: null
};
