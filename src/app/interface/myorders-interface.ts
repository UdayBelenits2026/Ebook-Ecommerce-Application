export interface MyOrder {
  id: number;
  user_id: number;
  total_amount: number;
  payment_method: string;
  order_status: string;
  address_id: number;
  shipping_address: string;
  created_at: string;
  items: MyOrderItem[];

  // Frontend only
  expanded?: boolean;
}

export interface MyOrderItem {
  id: number;
  book_id: number;
  title: string;
  author: string;
  image: string;
  quantity: number;
  price: number;
}

export interface OrderDetail {
  id: number;
  user_id: number;
  total_amount: number;
  payment_method: string;
  order_status: string;
  address_id: number;
  shipping_address: string;
  created_at: string;

  subtotal: number;
  shipping: number;
  grand_total: number;

  items: OrderDetailItem[];
}

export interface OrderDetailItem {
  id: number;
  book_id: number;
  title: string;
  author: string;
  image: string;
 quantity: number;
  price: number;
  subtotal: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}