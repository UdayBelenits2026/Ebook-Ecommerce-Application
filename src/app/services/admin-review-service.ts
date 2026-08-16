import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {

  ApiResponse,

  Review

} from '../interface/admin-review-interface';

@Injectable({
  providedIn: 'root'
})
export class AdminReviewService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://127.0.0.1:8000/admin/reviews';

  getReviews(): Observable<ApiResponse<Review[]>> {

    const apiRoot = 'http://127.0.0.1:8000';

    return this.http.get<ApiResponse<Review[]>>(this.apiUrl).pipe(
      map(res => {
        if (res && res.data && Array.isArray(res.data)) {
          res.data = res.data.map((r: Review) => {
            if ((r as any).profile_image) {
              const img = (r as any).profile_image;
              if (!img.startsWith('http')) {
                (r as any).profile_image = apiRoot + img + '?t=' + Date.now();
              } else {
                (r as any).profile_image = img + '?t=' + Date.now();
              }
            }
            return r;
          });
        }
        return res;
      })
    );

  }

  deleteReview(id:number){

    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/${id}`
    );

  }

}