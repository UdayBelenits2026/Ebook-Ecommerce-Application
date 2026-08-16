export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Address {
  id: number;

  full_name: string;

  mobile: string;

  house_no: string;

  street: string | null;

  area: string;

  village_city: string;

  district: string;

  state: string;

  pincode: string;

  landmark: string | null;

  is_default: boolean;

  created_at?: string;

  updated_at?: string;
}

export interface AddressRequest {
  full_name: string;

  mobile: string;

  house_no: string;

  street?: string;

  area: string;

  village_city: string;

  district: string;

  state: string;

  pincode: string;

  landmark?: string;

  is_default: boolean;
}
