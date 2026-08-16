import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CheckoutService } from './checkout-service';

describe('CheckoutService', ()=>{ let service: CheckoutService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(CheckoutService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('placeOrder posts to /orders/place', ()=>{ service.placeOrder({} as any).subscribe(); const req = httpMock.expectOne('http://localhost:8000/orders/place'); expect(req.request.method).toBe('POST'); req.flush({}); });
 it('getOrderDetail requests /orders/{id}', ()=>{ service.getOrderDetail(9).subscribe(); const req = httpMock.expectOne('http://localhost:8000/orders/9'); expect(req.request.method).toBe('GET'); req.flush({}); });
});
