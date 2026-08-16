import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReviewService } from '../../services/review-service';
import { Review, ReviewSummary } from '../../interface/review-interface';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class ReviewsComponent implements OnInit {
  @Input() bookId!: number;

  private reviewService = inject(ReviewService);

  reviews: Review[] = [];

  summary?: ReviewSummary;

  rating = 5;

  review = '';

  loading = false;

  submitting = false;

  ngOnInit(): void {
    this.loadReviews();

    this.loadSummary();
  }

  loadReviews() {
    this.loading = true;

    this.reviewService.getReviews(this.bookId).subscribe({
      next: (res) => {
        this.reviews = res.data;

        this.loading = false;
      },

      error: () => {
        this.loading = false;
      },
    });
  }

  loadSummary() {
    this.reviewService.getSummary(this.bookId).subscribe({
      next: (res) => {
        this.summary = res.data;
      },
    });
  }

  submitReview() {
    if (!this.review.trim()) {
      alert('Write your review');

      return;
    }

    this.submitting = true;

    this.reviewService
      .addReview({
        book_id: this.bookId,

        rating: this.rating,

        review: this.review,
      })
      .subscribe({
        next: (res) => {
          alert(res.message);

          this.review = '';

          this.rating = 5;

          this.loadReviews();

          this.loadSummary();

          this.submitting = false;
        },

        error: () => {
          this.submitting = false;
        },
      });
  }
}
