import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { authInterceptor } from './auth-interceptor-interceptor';
import { AuthService } from '../services/auth-services';
import { Router } from '@angular/router';

describe('authInterceptor', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const execute = (req: HttpRequest<any>, next: (req: HttpRequest<any>) => any) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['getToken', 'clearSession']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authSpy,
        },

        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });

    spyOn(window, 'alert');
  });

  it('should pass request without token', (done) => {
    authSpy.getToken.and.returnValue(null);

    const req = new HttpRequest('GET', 'http://api.test.com/books');

    execute(req, (request) => {
      expect(request.headers.has('Authorization')).toBeFalse();

      return of({} as HttpEvent<any>);
    }).subscribe(() => done());
  });

  it('should add authorization header when token exists', (done) => {
    authSpy.getToken.and.returnValue('abc123');

    const req = new HttpRequest('GET', 'http://api.test.com/books');

    execute(req, (request) => {
      expect(request.headers.get('Authorization')).toContain('abc123');

      return of({} as HttpEvent<any>);
    }).subscribe(() => done());
  });

  it('should handle 401 error and logout user', (done) => {
    authSpy.getToken.and.returnValue('token');

    const req = new HttpRequest('GET', 'http://api.test.com/admin');

    const error = new HttpErrorResponse({
      status: 401,

      url: req.url,
    });

    execute(req, () => throwError(() => error)).subscribe({
      error: (err) => {
        expect(err).toBe(error);

        expect(authSpy.clearSession).toHaveBeenCalled();

        expect(window.alert).toHaveBeenCalled();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);

        done();
      },
    });
  });

  it('should not logout on login API 401', (done) => {
   const req = new HttpRequest<any>(
  'POST',
  'http://api.test.com/auth/login',
  null
);

    const error = new HttpErrorResponse({
      status: 401,

      url: req.url,
    });

    execute(req, () => throwError(() => error)).subscribe({
      error: () => {
        expect(authSpy.clearSession).not.toHaveBeenCalled();

        expect(routerSpy.navigate).not.toHaveBeenCalled();

        done();
      },
    });
  });

  it('should handle 403 forbidden error', (done) => {
    const req = new HttpRequest('GET', 'http://api.test.com/admin');

    const error = new HttpErrorResponse({
      status: 403,

      url: req.url,
    });

    execute(req, () => throwError(() => error)).subscribe({
      error: (err) => {
        expect(err).toBe(error);

        expect(window.alert).toHaveBeenCalled();

        done();
      },
    });
  });
});
