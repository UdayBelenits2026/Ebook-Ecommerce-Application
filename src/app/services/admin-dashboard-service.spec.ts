import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './admin-dashboard-service';

describe('DashboardService', ()=>{ let service: DashboardService; let httpMock: HttpTestingController; beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service=TestBed.inject(DashboardService); httpMock=TestBed.inject(HttpTestingController); }); afterEach(()=>httpMock.verify());
 it('getDashboardStatistics GET /admin/dashboard', ()=>{ service.getDashboardStatistics().subscribe(); const req = httpMock.expectOne('http://127.0.0.1:8000/admin/dashboard'); expect(req.request.method).toBe('GET'); req.flush({ data: {} }); });
});
