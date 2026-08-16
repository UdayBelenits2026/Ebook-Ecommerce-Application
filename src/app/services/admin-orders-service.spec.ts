import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminOrdersService } from './admin-orders-service';

describe('AdminOrdersService', ()=>{ let service: AdminOrdersService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(AdminOrdersService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getOrders GET /admin/orders', ()=>{ service.getOrders().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/orders'); expect(req.request.method).toBe('GET'); req.flush({ data: [] }); });
 it('updateStatus patches status endpoint', ()=>{ service.updateStatus(1,{status:'shipped'} as any).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/orders/1/status'); expect(req.request.method).toBe('PATCH'); req.flush({}); });
});
