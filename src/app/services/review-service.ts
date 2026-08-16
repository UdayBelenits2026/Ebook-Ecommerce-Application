import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse, Review, ReviewSummary, AddReview } from '../interface/review-interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly http = inject(HttpClient);

  private readonly api = 'http://127.0.0.1:8000/reviews';

  // GET REVIEWS

  getReviews(bookId: number): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${this.api}/${bookId}`);
  }

  // GET REVIEW SUMMARY

  getSummary(bookId: number): Observable<ApiResponse<ReviewSummary>> {
    return this.http.get<ApiResponse<ReviewSummary>>(`${this.api}/${bookId}/summary`);
  }

  // ADD REVIEW

  addReview(data: AddReview): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(this.api, data);
  }
}
