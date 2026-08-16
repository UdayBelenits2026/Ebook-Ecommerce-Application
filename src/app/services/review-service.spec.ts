import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review-service';

describe('ReviewService', () => {
  let service: ReviewService; let httpMock: HttpTestingController;
  beforeEach(() => { TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service = TestBed.inject(ReviewService); httpMock = TestBed.inject(HttpTestingController); });
  afterEach(()=>httpMock.verify());

  it('getReviews calls correct url', () => {
    service.getReviews(5).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/reviews/5');
    expect(req.request.method).toBe('GET');
    req.flush({ data: [] });
  });

  it('getSummary calls summary url', () => {
    service.getSummary(7).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/reviews/7/summary');
    expect(req.request.method).toBe('GET');
    req.flush({ data: { avg: 4 } });
  });

  it('addReview posts to api', () => {
    const body = { book_id: 1, rating: 5, review: 'ok' } as any;
    service.addReview(body).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/reviews');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'ok' });
  });
});
