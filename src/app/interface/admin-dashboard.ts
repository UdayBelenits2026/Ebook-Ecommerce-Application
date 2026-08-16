

export interface DashboardApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface DashboardStatistics {

  total_users: number;

  total_books: number;

  total_categories: number;

  total_orders: number;

  total_revenue: number;

  low_stock_books: LowStockBook[];

}


export interface LowStockBook {

  id: number;

  title: string;

  stock: number;

}

export interface DashboardCard {

  title: string;

  value: number | string;

  icon: string;

  color: string;

}