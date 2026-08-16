import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth-services';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);

  const authService = inject(AuthService);

  const token = authService.getToken();

  // GET REQUEST PATH

  let pathname = '';

  try {
    const url = new URL(req.url);

    pathname = url.pathname;
  } catch {
    pathname = req.url.split('?')[0];
  }

  // PUBLIC API ENDPOINTS

  const publicApis = [
    '/auth/login',

    '/auth/register',

    '/auth/forgot-password',

    '/auth/reset-password',

    '/contact',
  ];

  const isPublicApi = publicApis.includes(pathname);

  // CLONE REQUEST

  let request = req;

  // ATTACH JWT TOKEN

  if (token && !isPublicApi) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // SEND REQUEST

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // DEBUG

      console.error('HTTP Error:', {
        status: error.status,
        url: request.url,
        message: error.message,
      });

      // 401 - UNAUTHORIZED

      if (error.status === 401) {
        const isLoginRequest = pathname === '/auth/login';

        if (!isLoginRequest) {
          authService.clearSession();

          alert('Session expired. Please login again.');

          router.navigate(['/login']);
        }
      }

      // 403 - FORBIDDEN
      else if (error.status === 403) {
        alert('You are not authorized to access this resource.');
      }

      return throwError(() => error);
    }),
  );
};
