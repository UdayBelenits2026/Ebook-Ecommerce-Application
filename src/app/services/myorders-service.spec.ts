import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyordersService } from './myorders-service';

describe('MyordersService', () => { let service: MyordersService; let httpMock: HttpTestingController;
  beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(MyordersService); httpMock=TestBed.inject(HttpTestingController); });
  afterEach(()=>httpMock.verify());

  it('getOrders calls /orders', ()=>{ service.getOrders().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/orders'); expect(req.request.method).toBe('GET'); req.flush({ data: [] }); });
  it('getOrder calls /orders/{id}', ()=>{ service.getOrder(11).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/orders/11'); expect(req.request.method).toBe('GET'); req.flush({ data: {} }); });
  it('cancelOrder issues DELETE to cancel', ()=>{ service.cancelOrder(12).subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/orders/cancel/12'); expect(req.request.method).toBe('DELETE'); req.flush({}); });
});
