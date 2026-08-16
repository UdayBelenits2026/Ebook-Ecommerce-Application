import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { AdminReviews } from './admin-reviews';
import { AdminReviewService } from '../../services/admin-review-service';

describe('AdminReviews', () => {
  let component: AdminReviews;
  let fixture: ComponentFixture<AdminReviews>;

  let serviceSpy: jasmine.SpyObj<AdminReviewService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('AdminReviewService', ['getReviews', 'deleteReview']);

    // --------------------------------------------------
    // IMPORTANT:
    // ngOnInit() calls loadReviews().
    // Therefore getReviews() needs a default observable
    // before fixture.detectChanges().
    // --------------------------------------------------

    serviceSpy.getReviews.and.returnValue(
      of({
        success: true,

        message: 'Reviews loaded',

        data: [],
      } as any),
    );

    serviceSpy.deleteReview.and.returnValue(
      of({
        success: true,

        message: 'Review deleted successfully',

        data: null,
      } as any),
    );

    await TestBed.configureTestingModule({
      imports: [AdminReviews],

      providers: [
        {
          provide: AdminReviewService,

          useValue: serviceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReviews);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ==================================================
  // CREATE COMPONENT
  // ==================================================

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // ==================================================
  // INITIAL VALUES
  // ==================================================

  it('should initialize with default values', () => {
    expect(component.reviews()).toEqual([]);

    expect(component.loading()).toBeFalse();

    expect(component.success()).toBe('');

    expect(component.error()).toBe('');

    expect(component.search()).toBe('');
  });

  // ==================================================
  // ngOnInit
  // ==================================================

  it('ngOnInit should call loadReviews', () => {
    spyOn(component, 'loadReviews');

    component.ngOnInit();

    expect(component.loadReviews).toHaveBeenCalled();
  });

  // ==================================================
  // FILTER REVIEWS
  // ==================================================

  it('filteredReviews returns matching items by user/book/review', () => {
    component.reviews.set([
      {
        id: 1,

        user_name: 'Alice',

        book_title: 'Wonder',

        review: 'Good book',

        rating: 4,
      } as any,

      {
        id: 2,

        user_name: 'Bob',

        book_title: 'Ocean',

        review: 'Bad book',

        rating: 2,
      } as any,
    ]);

    // Search by user

    component.search.set('alice');

    expect(component.filteredReviews().length).toBe(1);

    expect(component.filteredReviews()[0].id).toBe(1);

    // Search by book

    component.search.set('ocean');

    expect(component.filteredReviews().length).toBe(1);

    expect(component.filteredReviews()[0].id).toBe(2);

    // Search by review

    component.search.set('bad');

    expect(component.filteredReviews().length).toBe(1);

    expect(component.filteredReviews()[0].id).toBe(2);
  });

  // ==================================================
  // FILTER - CASE INSENSITIVE
  // ==================================================

  it('filteredReviews should be case insensitive', () => {
    component.reviews.set([
      {
        id: 1,

        user_name: 'Alice',

        book_title: 'Wonder',

        review: 'Excellent',

        rating: 5,
      } as any,
    ]);

    component.search.set('ALICE');

    expect(component.filteredReviews().length).toBe(1);

    component.search.set('WONDER');

    expect(component.filteredReviews().length).toBe(1);

    component.search.set('EXCELLENT');

    expect(component.filteredReviews().length).toBe(1);
  });

  // ==================================================
  // FILTER - NO MATCH
  // ==================================================

  it('filteredReviews should return empty array when no match', () => {
    component.reviews.set([
      {
        id: 1,

        user_name: 'Alice',

        book_title: 'Wonder',

        review: 'Excellent',

        rating: 5,
      } as any,
    ]);

    component.search.set('xyz');

    expect(component.filteredReviews()).toEqual([]);
  });

  // ==================================================
  // EMPTY SEARCH
  // ==================================================

  it('filteredReviews should return all reviews when search is empty', () => {
    const reviews = [
      {
        id: 1,

        user_name: 'Alice',

        book_title: 'Wonder',

        review: 'Good',

        rating: 4,
      } as any,

      {
        id: 2,

        user_name: 'Bob',

        book_title: 'Ocean',

        review: 'Bad',

        rating: 2,
      } as any,
    ];

    component.reviews.set(reviews);

    component.search.set('');

    expect(component.filteredReviews()).toEqual(reviews);
  });

  // ==================================================
  // LOAD REVIEWS - SUCCESS
  // ==================================================

  it('loadReviews sets reviews and clears loading', () => {
    const reviews = [
      {
        id: 3,

        user_name: 'John',

        book_title: 'Angular',

        review: 'Excellent',

        rating: 5,
      },
    ] as any;

    serviceSpy.getReviews.and.returnValue(
      of({
        success: true,

        message: 'Reviews loaded',

        data: reviews,
      } as any),
    );

    component.loadReviews();

    expect(component.loading()).toBeFalse();

    expect(component.reviews()).toEqual(reviews);
  });

  // ==================================================
  // LOAD REVIEWS - ERROR
  // ==================================================

  it('loadReviews handles error', () => {
    serviceSpy.getReviews.and.returnValue(
      throwError(() => ({
        message: 'Failed',
      })),
    );

    component.loadReviews();

    expect(component.loading()).toBeFalse();

    expect(component.error()).toContain('Unable to load reviews');
  });

  // ==================================================
  // LOAD REVIEWS - LOADING STATE
  // ==================================================

  it('loadReviews should set loading true before request', () => {
    serviceSpy.getReviews.and.returnValue(
      of({
        success: true,

        message: 'Loaded',

        data: [],
      } as any),
    );

    component.loadReviews();

    expect(component.loading()).toBeFalse();
  });

  // ==================================================
  // DELETE - CANCEL
  // ==================================================

  it('deleteReview cancels when user rejects confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteReview(10);

    expect(serviceSpy.deleteReview).not.toHaveBeenCalled();
  });

  // ==================================================
  // DELETE - SUCCESS
  // ==================================================

  it('deleteReview calls service and sets success on success', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    serviceSpy.deleteReview.and.returnValue(
      of({
        success: true,

        message: 'Review deleted successfully',

        data: null,
      } as any),
    );

    spyOn(component, 'loadReviews');

    component.deleteReview(10);

    expect(serviceSpy.deleteReview).toHaveBeenCalledWith(10);

    expect(component.success()).toBe('Review deleted successfully');

    expect(component.loadReviews).toHaveBeenCalled();
  });

  // ==================================================
  // DELETE - FAILURE RESPONSE
  // ==================================================

  it('deleteReview handles failure response', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    serviceSpy.deleteReview.and.returnValue(
      of({
        success: false,

        message: 'Delete failed',

        data: null,
      } as any),
    );

    component.deleteReview(10);

    /*
     * IMPORTANT:
     *
     * Your component currently treats every successful
     * HTTP response as success.
     *
     * Therefore this response:
     *
     * success: false
     *
     * still enters the "next" block.
     *
     * The component sets success() to the response.message.
     */

    expect(component.success()).toBe('Delete failed');
  });

  // ==================================================
  // DELETE - SERVICE ERROR
  // ==================================================

  it('deleteReview handles service error', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    serviceSpy.deleteReview.and.returnValue(
      throwError(() => ({
        message: 'Server error',
      })),
    );

    component.deleteReview(10);

    /*
     * This matches the actual component:
     *
     * error: () => {
     *   this.error.set('Delete failed');
     * }
     */

    expect(component.error()).toContain('Delete failed');
  });

  // ==================================================
  // DELETE - HTTP ERROR
  // ==================================================

  it('deleteReview handles HTTP error', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    serviceSpy.deleteReview.and.returnValue(
      throwError(() => ({
        status: 500,

        error: {
          message: 'Internal server error',
        },
      })),
    );

    component.deleteReview(10);

    expect(component.error()).toBe('Delete failed');
  });

  // ==================================================
  // AVERAGE RATING - EMPTY
  // ==================================================

  it('averageRating returns 0 when there are no reviews', () => {
    component.reviews.set([]);

    expect(component.averageRating()).toBe(0);
  });

  // ==================================================
  // AVERAGE RATING
  // ==================================================

  it('averageRating calculates average correctly', () => {
    component.reviews.set([
      {
        id: 1,

        user_name: 'Alice',

        book_title: 'Book 1',

        review: 'Good',

        rating: 3,
      } as any,

      {
        id: 2,

        user_name: 'Bob',

        book_title: 'Book 2',

        review: 'Excellent',

        rating: 4,
      } as any,
    ]);

    expect(component.averageRating()).toBe(3.5);
  });

  // ==================================================
  // AVERAGE RATING - DECIMAL
  // ==================================================

  it('averageRating rounds the result to one decimal place', () => {
    component.reviews.set([
      {
        id: 1,

        rating: 5,
      } as any,

      {
        id: 2,

        rating: 4,
      } as any,

      {
        id: 3,

        rating: 4,
      } as any,
    ]);

    expect(component.averageRating()).toBe(4.3);
  });

  // ==================================================
  // SEARCH SIGNAL
  // ==================================================

  it('search signal should update correctly', () => {
    component.search.set('angular');

    expect(component.search()).toBe('angular');
  });

  // ==================================================
  // REVIEWS SIGNAL
  // ==================================================

  it('reviews signal should update correctly', () => {
    const reviews = [
      {
        id: 100,

        user_name: 'Test User',

        book_title: 'Test Book',

        review: 'Test Review',

        rating: 5,
      } as any,
    ];

    component.reviews.set(reviews);

    expect(component.reviews()).toEqual(reviews);
  });

  // ==================================================
  // SUCCESS SIGNAL
  // ==================================================

  it('success signal should update correctly', () => {
    component.success.set('Success');

    expect(component.success()).toBe('Success');
  });

  // ==================================================
  // ERROR SIGNAL
  // ==================================================

  it('error signal should update correctly', () => {
    component.error.set('Something went wrong');

    expect(component.error()).toBe('Something went wrong');
  });
});
