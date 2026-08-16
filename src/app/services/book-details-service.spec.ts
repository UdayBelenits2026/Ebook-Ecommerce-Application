import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookDetailsService } from './book-details-service';

describe('BookDetailsService', ()=>{ let service: BookDetailsService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(BookDetailsService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getBook calls /books/{id}', ()=>{ service.getBook(3).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/books/3'); expect(req.request.method).toBe('GET'); req.flush({ data: {} }); });
});
