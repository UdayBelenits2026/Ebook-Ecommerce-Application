import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth-services';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Ensure clean localStorage for deterministic tests
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }, AuthService]
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('initially reports not logged in when no token in localStorage', () => {
    expect(service.isUserLoggedIn()).toBeFalse();
    expect(service.getToken()).toBeNull();
    expect(service.getRole()).toBeNull();
    expect(service.getUserId()).toBeNull();
  });

  it('setSession stores session to localStorage and updates signals', () => {
    const data = {
      access_token: 'abc123',
      token_type: 'Bearer',
      role: 'customer',
      id: 42,
      full_name: 'Jane Doe',
      email: 'jane@example.com'
    };

    service.setSession(data);

    expect(localStorage.getItem('access_token')).toBe('abc123');
    expect(localStorage.getItem('token_type')).toBe('Bearer');
    expect(localStorage.getItem('role')).toBe('customer');
    expect(localStorage.getItem('id')).toBe('42');
    expect(localStorage.getItem('full_name')).toBe('Jane Doe');
    expect(localStorage.getItem('email')).toBe('jane@example.com');

    // signals/derived getters
    expect(service.getToken()).toBe('abc123');
    expect(service.getRole()).toBe('customer');
    expect(service.getUserId()).toBe(42);
    expect(service.getFullName()).toBe('Jane Doe');
    expect(service.getEmail()).toBe('jane@example.com');

    expect(service.isUserLoggedIn()).toBeTrue();
    expect(service.normalizedRole()).toBe('CUSTOMER');

    const current = service.getCurrentUser();
    expect(current.id).toBe(42);
    expect(current.full_name).toBe('Jane Doe');
    expect(current.email).toBe('jane@example.com');
    expect(current.role).toBe('customer');
  });

  it('isAdmin returns true only for ADMIN role (case-insensitive)', () => {
    service.setSession({
      access_token: 't', token_type: 't', role: 'admin', id: 1, full_name: 'A', email: 'a@a.com'
    });
    expect(service.isAdmin()).toBeTrue();

    service.setSession({
      access_token: 't', token_type: 't', role: 'ADMIN', id: 1, full_name: 'A', email: 'a@a.com'
    });
    expect(service.isAdmin()).toBeTrue();

    service.setSession({
      access_token: 't', token_type: 't', role: 'user', id: 1, full_name: 'A', email: 'a@a.com'
    });
    expect(service.isAdmin()).toBeFalse();
  });

  it('isCustomer returns true for CUSTOMER or USER roles', () => {
    service.setSession({
      access_token: 't', token_type: 't', role: 'customer', id: 2, full_name: 'C', email: 'c@c.com'
    });
    expect(service.isCustomer()).toBeTrue();

    service.setSession({
      access_token: 't', token_type: 't', role: 'USER', id: 2, full_name: 'C', email: 'c@c.com'
    });
    expect(service.isCustomer()).toBeTrue();

    service.setSession({
      access_token: 't', token_type: 't', role: 'ADMIN', id: 2, full_name: 'C', email: 'c@c.com'
    });
    expect(service.isCustomer()).toBeFalse();
  });

  it('clearSession clears localStorage and resets signals', () => {
    service.setSession({
      access_token: 'x', token_type: 't', role: 'user', id: 99, full_name: 'X', email: 'x@x.com'
    });

    spyOn(localStorage, 'clear').and.callThrough();

    service.clearSession();

    expect(localStorage.clear).toHaveBeenCalled();
    expect(service.getToken()).toBeNull();
    expect(service.getRole()).toBeNull();
    expect(service.getUserId()).toBeNull();
    expect(service.getFullName()).toBeNull();
    expect(service.getEmail()).toBeNull();
    expect(service.isUserLoggedIn()).toBeFalse();
  });

  it('logout clears session and navigates to /login', () => {
    spyOn(service, 'clearSession').and.callThrough();

    service.logout();

    expect(service.clearSession).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

});
