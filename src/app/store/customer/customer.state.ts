export interface CustomerState {
  profile: any | null;
  addresses: any[];
  notifications: any[];
  reviews: any[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const initialCustomerState: CustomerState = {
  profile: null,
  addresses: [],
  notifications: [],
  reviews: [],
  loading: false,
  error: null,
  successMessage: null
};
