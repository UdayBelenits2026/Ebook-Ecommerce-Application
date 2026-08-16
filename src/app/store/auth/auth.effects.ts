import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { LoginService } from '../../services/login-service';
import { RegisterService } from '../../services/register-service';
import { AuthService } from '../../services/auth-services';

import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private loginService = inject(LoginService);
  private registerService = inject(RegisterService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // ============================================================
  // LOGIN
  // ============================================================

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),

      switchMap(({ credentials }) =>
        this.loginService.LoginUser(credentials).pipe(

          // LOGIN SUCCESS
          map((response: any) => {
            const data = response.data || response;

            // Store login information
            this.authService.setSession(data);

            return AuthActions.loginSuccess({
              response: data,
            });
          }),

          // LOGIN FAILURE
          catchError((error) => {
            let message = 'Something went wrong. Please try again.';

            // Wrong email or password
            if (error.status === 401 || error.status === 404) {
              message = 'Invalid email or password';
            }

            // Backend is not running / connection refused
            else if (error.status === 0) {
              message = 'Unable to connect to server. Please try again.';
            }

            return of(
              AuthActions.loginFailure({
                error: message,
              }),
            );
          }),
        ),
      ),
    ),
  );

  // ============================================================
  // LOGIN SUCCESS
  // ============================================================

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),

        tap(({ response }) => {
          const role = (response.role || '').toUpperCase();

          if (role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/customer']);
          }
        }),
      ),
    {
      dispatch: false,
    },
  );

  // ============================================================
  // SIGNUP
  // ============================================================

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),

      mergeMap(({ userData }) =>
        this.registerService.registerUser(userData).pipe(

          // SIGNUP SUCCESS
          map((response: any) =>
            AuthActions.signupSuccess({
              response,
            }),
          ),

          // SIGNUP FAILURE
          catchError((error) =>
            of(
              AuthActions.signupFailure({
                error:
                  error?.error?.message ??
                  error?.error?.detail ??
                  'Registration failed.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // ============================================================
  // LOGOUT
  // ============================================================

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),

        tap(() => {
          this.authService.clearSession();

          this.router.navigate(['/login']);
        }),
      ),
    {
      dispatch: false,
    },
  );
}