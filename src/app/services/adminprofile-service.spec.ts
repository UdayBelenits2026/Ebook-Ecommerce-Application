import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminProfileService } from './adminprofile-service';

describe('AdminProfileService', ()=>{ let service: AdminProfileService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(AdminProfileService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getProfile requests /admin/profile', ()=>{ service.getProfile().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/profile'); expect(req.request.method).toBe('GET'); req.flush({}); });
});
