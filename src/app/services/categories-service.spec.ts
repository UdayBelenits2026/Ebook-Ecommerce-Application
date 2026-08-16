import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoriesService } from './categories-service';

describe('CategoriesService', ()=>{ let service: CategoriesService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(CategoriesService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getCategories handles backend wrapper', ()=>{ service.getCategories().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/categories'); expect(req.request.method).toBe('GET'); req.flush({ data: [] }); });
 it('createCategory posts JSON when no image', ()=>{ service.createCategory({ name:'a' } as any).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/categories'); expect(req.request.method).toBe('POST'); req.flush({}); });
});
