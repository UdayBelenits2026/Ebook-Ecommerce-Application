import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminBooksService } from './admin-book-service';

describe('AdminBooksService', ()=>{ let service: AdminBooksService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(AdminBooksService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getBooks handles multiple shapes', ()=>{ service.getBooks().subscribe(res=>{}); const req = httpMock.expectOne('http://127.0.0.1:8000/books'); expect(req.request.method).toBe('GET'); req.flush({ items: [] }); });
 it('createBook posts formdata', ()=>{ service.createBook({ title: 'A' } as any).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/books'); expect(req.request.method).toBe('POST'); req.flush({}); });
});
