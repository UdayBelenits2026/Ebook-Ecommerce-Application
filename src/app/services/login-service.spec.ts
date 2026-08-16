import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login-service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => httpMock.verify());
  it('LoginUser posts to /auth/login', () => {
    service.LoginUser({} as any).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
  it('LogoutUser posts to /auth/logout', () => {
    service.LogoutUser().subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
  it('ForgotPass posts to /auth/forgot-password', () => {
    service.ForgotPass({} as any).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/auth/forgot-password');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
