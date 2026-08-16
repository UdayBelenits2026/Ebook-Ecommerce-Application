import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminUsersService } from './admin-users-service';

describe('AdminUsersService', ()=>{ let service: AdminUsersService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(AdminUsersService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getUsers GET /admin/users', ()=>{ service.getUsers().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/users'); expect(req.request.method).toBe('GET'); req.flush({ data: [] }); });
 it('updateStatus PATCH to status endpoint', ()=>{ service.updateStatus(1,{status:'active'} as any).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/users/1/status'); expect(req.request.method).toBe('PATCH'); req.flush({}); });
});
