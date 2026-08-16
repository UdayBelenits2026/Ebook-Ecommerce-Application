import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyaccountService } from './myaccount-service';

describe('MyaccountService', () => { let service: MyaccountService; let httpMock: HttpTestingController;
 beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(MyaccountService); httpMock=TestBed.inject(HttpTestingController); });
 afterEach(()=>httpMock.verify());

 it('getProfile GET /users/me', ()=>{ service.getProfile().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/users/me'); expect(req.request.method).toBe('GET'); req.flush({ data: {} }); });
 it('updateProfile PUT /users/me', ()=>{ service.updateProfile({} as any).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/users/me'); expect(req.request.method).toBe('PUT'); req.flush({}); });
 it('uploadAvatar posts form data', ()=>{ const file = new File(['x'], 'a.png'); service.uploadAvatar(file).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/users/me/avatar'); expect(req.request.method).toBe('POST'); req.flush({}); });
});
