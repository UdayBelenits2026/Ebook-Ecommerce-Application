import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddressService } from './address-service';

describe('AddressService', ()=>{ let service: AddressService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(AddressService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getAddresses GET /addresses', ()=>{ service.getAddresses().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/addresses'); expect(req.request.method).toBe('GET'); req.flush({ data: [] }); });
 it('addAddress posts to /addresses', ()=>{ service.addAddress({} as any).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/addresses'); expect(req.request.method).toBe('POST'); req.flush({}); });
});
