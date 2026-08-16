import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './bookservices';

describe('BookService', ()=>{ let service: BookService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(BookService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getBooks sends params and maps items', ()=>{ service.getBooks(2,10,'search',5,100,200,'price').subscribe(res=>{ expect(res.page).toBeDefined(); }); const req = httpMock.expectOne(r => r.url === 'http://127.0.0.1:8000/books'); expect(req.request.method).toBe('GET'); req.flush({ data:{ items: [{ id:1, price: '50', image: 'img.png' }], page:2, limit:10 }});
 });
});
