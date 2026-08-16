import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminReviewService } from '../../services/admin-review-service';
import { Review } from '../../interface/admin-review-interface';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-reviews.html',
  styleUrl: './admin-reviews.css'
})
export class AdminReviews implements OnInit {

  private readonly service = inject(AdminReviewService);

  reviews = signal<Review[]>([]);

  loading = signal(false);

  success = signal('');

  error = signal('');

  search = signal('');

  filteredReviews = computed(() => {

    const keyword = this.search().toLowerCase();

    return this.reviews().filter(review =>

      review.user_name.toLowerCase().includes(keyword)

      ||

      review.book_title.toLowerCase().includes(keyword)

      ||

      review.review.toLowerCase().includes(keyword)

    );

  });

  ngOnInit(): void {

    this.loadReviews();

  }

  loadReviews(): void {

    this.loading.set(true);

    this.service.getReviews().subscribe({

      next: (response) => {

        this.reviews.set(response.data);

        this.loading.set(false);

      },

      error: () => {

        this.error.set('Unable to load reviews');

        this.loading.set(false);

      }

    });

  }

  deleteReview(id: number): void {

    if (!confirm('Delete this review?')) {

      return;

    }

    this.service.deleteReview(id).subscribe({

      next: (response) => {

        this.success.set(response.message);

        this.loadReviews();

      },

      error: () => {

        this.error.set('Delete failed');

      }

    });

  }

  averageRating(): number {

    if (!this.reviews().length) {

      return 0;

    }

    const total = this.reviews().reduce((sum, review) => sum + review.rating, 0);

    return Number((total / this.reviews().length).toFixed(1));

  }

}