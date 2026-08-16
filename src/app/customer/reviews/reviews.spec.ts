import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ReviewsComponent as Reviews } from './reviews';
import { ReviewService } from '../../services/review-service';

describe('Reviews', () => {
  let component: Reviews;
  let fixture: ComponentFixture<Reviews>;
  let reviewSpy: jasmine.SpyObj<ReviewService>;

  beforeEach(async () => {
    reviewSpy = jasmine.createSpyObj('ReviewService', ['getReviews', 'getSummary', 'addReview']);

    // IMPORTANT: prevent undefined.subscribe error during ngOnInit
    reviewSpy.getReviews.and.returnValue(
      of({
        success: true,
        data: [],
      } as any),
    );

    reviewSpy.getSummary.and.returnValue(
      of({
        success: true,
        data: {
          average_rating: 0,
          total_reviews: 0,
        },
      } as any),
    );

    await TestBed.configureTestingModule({
      imports: [Reviews],

      providers: [
        {
          provide: ReviewService,
          useValue: reviewSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Reviews);

    component = fixture.componentInstance;

    component.bookId = 123;

    fixture.detectChanges();
  });

  it('should initialize component', () => {
    expect(component.bookId).toBe(123);
  });

  it('loadReviews loads reviews successfully', () => {
    const reviews = [
      {
        id: 1,
        review: 'Good book',
        rating: 5,
      },
    ];

    reviewSpy.getReviews.and.returnValue(
      of({
        success: true,
        data: reviews,
      } as any),
    );

    component.loadReviews();

    expect(component.reviews.length).toBe(1);

    expect(component.reviews[0].id).toBe(1);

    expect(component.loading).toBeFalse();
  });

  it('loadReviews handles error', () => {
    reviewSpy.getReviews.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Failed',
        },
      })),
    );

    component.loadReviews();

    expect(component.loading).toBeFalse();
  });

  it('loadSummary sets summary', () => {
    const summary = {
      average_rating: 4,

      total_reviews: 10,
    } as any;

    reviewSpy.getSummary.and.returnValue(
      of({
        success: true,

        data: summary,
      } as any),
    );

    component.loadSummary();

    expect(component.summary).toEqual(summary);
  });

  it('submitReview validates empty review', () => {
    spyOn(window, 'alert');

    component.review = '';

    component.submitReview();

    expect(window.alert).toHaveBeenCalledWith('Write your review');

    expect(reviewSpy.addReview).not.toHaveBeenCalled();
  });

  it('submitReview submits review successfully', () => {
    spyOn(window, 'alert');

    reviewSpy.addReview.and.returnValue(
      of({
        success: true,

        message: 'Review added successfully',
      } as any),
    );

    spyOn(component, 'loadReviews');

    spyOn(component, 'loadSummary');

    component.review = 'Nice book';

    component.rating = 4;

    component.submitReview();

    expect(reviewSpy.addReview).toHaveBeenCalled();

    expect(window.alert).toHaveBeenCalledWith('Review added successfully');

    expect(component.review).toBe('');

    expect(component.rating).toBe(5);

    expect(component.loadReviews).toHaveBeenCalled();

    expect(component.loadSummary).toHaveBeenCalled();

    expect(component.submitting).toBeFalse();
  });

  it('submitReview handles service error', () => {
    spyOn(window, 'alert');

    reviewSpy.addReview.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Unable to add review',
        },
      })),
    );

    component.review = 'Good';

    component.rating = 5;

    component.submitReview();

    expect(component.submitting).toBeFalse();
  });
});
