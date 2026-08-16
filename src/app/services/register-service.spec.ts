import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegisterService } from './register-service';

describe('RegisterService', () => {
  let service: RegisterService; let httpMock: HttpTestingController;
  beforeEach(()=>{ TestBed.configureTestingModule({ imports:[HttpClientTestingModule] }); service = TestBed.inject(RegisterService); httpMock = TestBed.inject(HttpTestingController); });
  afterEach(()=>httpMock.verify());

  it('registerUser posts to /auth/register', () => {
    const payload = { email: 'a' } as any;
    service.registerUser(payload).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush({ data: {} });
  });

  it('sendOtp posts to /auth/send-otp', () => {
    service.sendOtp({ email: 'a' } as any).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/auth/send-otp');
    expect(req.request.method).toBe('POST'); req.flush({});
  });

});
