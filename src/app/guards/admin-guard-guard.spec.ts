import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { adminGuard } from './admin-guard-guard';
import { AuthService } from '../services/auth-services';
import { Router } from '@angular/router';

describe('adminGuard', () => {
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (route, state) =>
    TestBed.runInInjectionContext(() => adminGuard(route, state));

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'isAdmin']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree']);

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
  });

  it('should redirect to login when user is not logged in', () => {
    authSpy.isLoggedIn.and.returnValue(false);

    const result = executeGuard(route, state);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);

    expect(result).toBeFalse();
  });

  it('should redirect customer when user is not admin', () => {
    authSpy.isLoggedIn.and.returnValue(true);

    authSpy.isAdmin.and.returnValue(false);

    const result = executeGuard(route, state);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/customer/my-account']);

    expect(result).toBeFalse();
  });

  it('should allow admin users', () => {
    authSpy.isLoggedIn.and.returnValue(true);

    authSpy.isAdmin.and.returnValue(true);

    const result = executeGuard(route, state);

    expect(result).toBeTrue();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
