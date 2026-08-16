import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Review, ReviewSummary, AddReview } from '../../interface/review-interface';

import { ReviewService } from '../../services/review-service';

import { AuthService } from '../../services/auth-services';

@Component({
  selector: 'app-book-reviews',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './book-review.html',

  styleUrl: './book-review.css',
})
export class BookReviews implements OnChanges {
  // INPUT

  @Input({ required: true })
  bookId!: number;

  // SERVICES

  private readonly reviewService = inject(ReviewService);

  private readonly authService = inject(AuthService);

  private readonly cdr = inject(ChangeDetectorRef);

  // DATA

  reviews: Review[] = [];

  summary: ReviewSummary | null = null;

  // REVIEW PAGINATION
  // Number of comments shown on one page.
  readonly pageSize = 2;

  // Current pagination page.
  currentPage = 1;

  // LOADING

  reviewsLoading = false;

  summaryLoading = false;

  submitting = false;

  // MESSAGES

  errorMessage = '';

  successMessage = '';

  // TOAST

  showToast = false;

  toastMessage = '';

  // REVIEW FORM

  selectedRating = 0;

  reviewText = '';

  // LIFECYCLE

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookId'] && this.bookId) {
      this.loadReviews();

      this.loadSummary();
    }
  }

  // LOAD REVIEWS

  loadReviews(): void {
    if (!this.bookId) {
      return;
    }

    this.reviewsLoading = true;

    this.errorMessage = '';

    this.cdr.detectChanges();

    this.reviewService.getReviews(this.bookId).subscribe({
      next: (response) => {
        this.reviews = response?.data ?? [];

        // Always start from the first page after loading/reloading reviews.
        this.currentPage = 1;

        this.reviewsLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.reviews = [];

        this.reviewsLoading = false;

        this.errorMessage = this.getErrorMessage(error, 'Unable to load reviews');

        this.cdr.detectChanges();
      },
    });
  }

  // REVIEW PAGINATION

  get paginatedReviews(): Review[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    return this.reviews.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.reviews.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.cdr.detectChanges();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.detectChanges();
    }
  }

  // LOAD SUMMARY

  loadSummary(): void {
    if (!this.bookId) {
      return;
    }

    this.summaryLoading = true;

    this.cdr.detectChanges();

    this.reviewService.getSummary(this.bookId).subscribe({
      next: (response) => {
        this.summary = response?.data ?? null;

        this.summaryLoading = false;

        this.cdr.detectChanges();
      },

      error: () => {
        this.summary = null;

        this.summaryLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // SELECT RATING

  selectRating(rating: number): void {
    this.selectedRating = rating;

    this.cdr.detectChanges();
  }

  // STAR CLASS

  getStarClass(star: number, rating: number): string {
    return star <= rating ? 'bi-star-fill' : 'bi-star';
  }

  // RATING STARS

  getRatingStars(rating: number): boolean[] {
    const roundedRating = Math.round(Number(rating) || 0);

    return Array.from({ length: 5 }, (_, index) => index < roundedRating);
  }

  // SUBMIT REVIEW

  submitReview(): void {
    this.errorMessage = '';

    this.successMessage = '';

    this.showToast = false;

    // -------------------------------------------------------
    // LOGIN
    // -------------------------------------------------------

    if (!this.isLoggedIn()) {
      this.errorMessage = 'Please login to write a review.';

      this.cdr.detectChanges();

      return;
    }

    // -------------------------------------------------------
    // RATING
    // -------------------------------------------------------

    if (!this.selectedRating || this.selectedRating < 1 || this.selectedRating > 5) {
      this.errorMessage = 'Please select a rating.';

      this.cdr.detectChanges();

      return;
    }

    // -------------------------------------------------------
    // COMMENT
    // -------------------------------------------------------

    const comment = this.reviewText.trim();

    if (!comment) {
      this.errorMessage = 'Please enter your review.';

      this.cdr.detectChanges();

      return;
    }

    // -------------------------------------------------------
    // MINIMUM COMMENT
    // -------------------------------------------------------

    if (comment.length < 3) {
      this.errorMessage = 'Review must contain at least 3 characters.';

      this.cdr.detectChanges();

      return;
    }

    // -------------------------------------------------------
    // PAYLOAD
    // -------------------------------------------------------

    const payload: AddReview = {
      book_id: this.bookId,

      rating: this.selectedRating,

      review: comment,
    };

    // -------------------------------------------------------
    // START SUBMIT
    // -------------------------------------------------------

    this.submitting = true;

    this.cdr.detectChanges();

    // -------------------------------------------------------
    // API
    // -------------------------------------------------------

    this.reviewService.addReview(payload).subscribe({
      next: (response) => {
        /*
         * IMPORTANT:
         * Stop spinner first.
         */

        this.submitting = false;

        this.successMessage = response?.message || 'Review added successfully.';

        // Reset form

        this.selectedRating = 0;

        this.reviewText = '';

        // Toast

        this.showSuccessToast('Review posted successfully!');

        // Reload data

        this.loadReviews();

        this.loadSummary();

        // Update UI immediately

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.submitting = false;

        this.errorMessage = this.getErrorMessage(error, 'Unable to add review');

        this.cdr.detectChanges();
      },
    });
  }

  // SUCCESS TOAST

  private showSuccessToast(message: string): void {
    this.toastMessage = message;

    this.showToast = true;

    this.cdr.detectChanges();

    setTimeout(() => {
      this.showToast = false;

      this.cdr.detectChanges();
    }, 3000);
  }

  // LOGIN

  isLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  // DATE

  formatDate(date: string): string {
    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // PROFILE IMAGE

  getProfileImage(image: string | null): string {
    if (!image) {
      return 'assets/images/user.png';
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    return `http://127.0.0.1:8000${image}`;
  }

  // IMAGE ERROR

  onProfileImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.src = 'assets/images/user.png';
  }

  // RATING COUNT

  getRatingCount(rating: number): number {
    if (!this.summary) {
      return 0;
    }

    const distribution = this.summary.rating_distribution;

    /*
     * IMPORTANT:
     *
     * Convert number to a valid key
     * before indexing the object.
     */

    const key = String(rating) as keyof typeof distribution;

    return distribution[key] ?? 0;
  }

  // RATING PERCENTAGE

  getRatingPercentage(rating: number): number {
    if (!this.summary || !this.summary.review_count) {
      return 0;
    }

    const count = this.getRatingCount(rating);

    return (count / this.summary.review_count) * 100;
  }

  // ERROR MESSAGE

  private getErrorMessage(error: any, fallback: string): string {
    return error?.error?.detail || error?.error?.message || error?.message || fallback;
  }
}
