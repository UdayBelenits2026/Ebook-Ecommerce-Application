import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminReviewService } from './admin-review-service';

describe('AdminReviewService', ()=>{ let service: AdminReviewService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(AdminReviewService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getReviews GET /admin/reviews', ()=>{ service.getReviews().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/reviews'); expect(req.request.method).toBe('GET'); req.flush({ data: [] }); });
 it('deleteReview sends DELETE', ()=>{ service.deleteReview(2).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/reviews/2'); expect(req.request.method).toBe('DELETE'); req.flush({}); });
});
