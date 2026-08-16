export interface AdminState {
  dashboardStats: any | null;
  books: any[];
  users: any[];
  orders: any[];
  reviews: any[];
  enquiries: any[];
  notifications: any[];
  adminProfile: any | null;
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const initialAdminState: AdminState = {
  dashboardStats: null,
  books: [],
  users: [],
  orders: [],
  reviews: [],
  enquiries: [],
  notifications: [],
  adminProfile: null,
  sidebarOpen: true,
  loading: false,
  error: null,
  successMessage: null
};
