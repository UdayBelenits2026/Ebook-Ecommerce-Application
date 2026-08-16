import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminEnquiryService } from './admin-enquiry';

describe('AdminEnquiryService', ()=>{ let service: AdminEnquiryService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(AdminEnquiryService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getMessages GET /admin/contact-messages', ()=>{ service.getMessages().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/contact-messages'); expect(req.request.method).toBe('GET'); req.flush({ data: [] }); });
 it('markAsRead patches read endpoint', ()=>{ service.markAsRead(5).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/contact-messages/5/read'); expect(req.request.method).toBe('PATCH'); req.flush({}); });
});
