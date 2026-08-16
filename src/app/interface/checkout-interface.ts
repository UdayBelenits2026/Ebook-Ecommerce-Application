export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PlaceOrderRequest {
  payment_method: string;
  address_id: number;
}

export interface PlaceOrderResponse {
  order_id: number;
  subtotal: number;
  shipping: number;
  total_amount: number;
}

export interface OrderItem {
  id: number;
  book_id: number;
  title: string;
  author: string;
  image: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  user_id: number;

  total_amount: number;

  payment_method: string;

  order_status: string;

  address_id: number;

  shipping_address: string;

  created_at: string;

  subtotal?: number;

  shipping?: number;

  grand_total?: number;

  items: OrderItem[];
}
