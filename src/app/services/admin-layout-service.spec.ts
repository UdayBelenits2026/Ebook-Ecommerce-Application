import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin-layout-service';

describe('AdminService', ()=>{ let service: AdminService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(AdminService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getProfile GET /admin/profile', ()=>{ service.getProfile().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/profile'); expect(req.request.method).toBe('GET'); req.flush({ data: { profile_image: '/img.png' } }); });
});
