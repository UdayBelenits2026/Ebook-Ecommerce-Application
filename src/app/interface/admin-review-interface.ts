export interface Review {

  id: number;

  user_id: number;

  user_name: string;

  book_id: number;

  book_title: string;

  rating: number;

  review: string;

  created_at: string;

}

export interface ApiResponse<T> {

  success: boolean;

  message: string;

  data: T;

}