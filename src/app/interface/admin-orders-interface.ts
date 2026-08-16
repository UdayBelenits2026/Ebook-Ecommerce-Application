export interface AdminOrder {

  id: number;

  user_id: number;

  user_name: string;

  email: string;

  phone: string;

  total_amount: number;

  payment_method: string;
  order_status: string;

  shipping_address: string;

  tracking_number: string | null;

  courier_name: string | null;

  estimated_delivery: string | null;

  created_at: string;

}

export interface OrdersResponse {

  success: boolean;

  message: string;

  data: AdminOrder[];

}

export interface OrderStatusUpdate {

  status: string;

}

export interface TrackingUpdate {

  tracking_number: string;

  courier_name: string;

  estimated_delivery: string;

}