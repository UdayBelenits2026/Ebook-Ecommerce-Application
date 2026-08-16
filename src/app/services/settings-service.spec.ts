import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsService } from './settings-service';

describe('SettingsService', () => {
  let service: SettingsService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(SettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => httpMock.verify());

  it('changePassword sends PUT to /customer/change-password', () => {
    const payload = { old_password: 'a', new_password: 'b' } as any;
    service.changePassword(payload).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/customer/change-password');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ message: 'ok' });
  });
});
