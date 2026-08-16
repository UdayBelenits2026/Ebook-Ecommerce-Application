export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Review {
  id: number;
  book_id: number;
  user_id: number;
  rating: number;
  review: string;
  created_at: string;
  full_name: string;
  profile_image: string | null;
}

export interface ReviewSummary {
  average_rating: number;
  review_count: number;
  rating_distribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

export interface AddReview {
  book_id: number;
  rating: number;
  review: string;
}