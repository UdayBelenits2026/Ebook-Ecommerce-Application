import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { RouterTestingModule } from '@angular/router/testing';

import { Resetpassword } from './resetpassword';

import { LoginService } from '../../services/login-service';

describe('Resetpassword', () => {
  let component: Resetpassword;

  let fixture: ComponentFixture<Resetpassword>;

  let svc: jasmine.SpyObj<LoginService>;

  let routerSpy: jasmine.SpyObj<Router>;

  // ============================================================
  // BEFORE EACH
  // ============================================================

  beforeEach(async () => {
    // ----------------------------------------------------------
    // Login Service Spy
    // ----------------------------------------------------------

    svc = jasmine.createSpyObj('LoginService', ['ResetPassword']);

    // ----------------------------------------------------------
    // Router Spy
    // ----------------------------------------------------------

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // ----------------------------------------------------------
    // Default API response
    // ----------------------------------------------------------

    svc.ResetPassword.and.returnValue(
      of({
        message: 'Password reset successfully',
      } as any),
    );

    // ----------------------------------------------------------
    // TestBed
    // ----------------------------------------------------------

    await TestBed.configureTestingModule({
      imports: [Resetpassword, RouterTestingModule],

      providers: [
        {
          provide: LoginService,

          useValue: svc,
        },

        {
          provide: Router,

          useValue: routerSpy,
        },

        // ------------------------------------------------------
        // ActivatedRoute mock
        // ------------------------------------------------------

        {
          provide: ActivatedRoute,

          useValue: {
            root: {},

            parent: null,

            firstChild: null,

            children: [],

            snapshot: {
              root: {},
            },

            params: of({}),

            queryParams: of({}),

            paramMap: of(null),

            queryParamMap: of(null),
          },
        },
      ],
    }).compileComponents();

    // ----------------------------------------------------------
    // Create component
    // ----------------------------------------------------------

    fixture = TestBed.createComponent(Resetpassword);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ============================================================
  // AFTER EACH
  // ============================================================

  afterEach(() => {
    localStorage.clear();
  });

  // ============================================================
  // CREATE COMPONENT
  // ============================================================

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  // FORM INITIALIZATION
  // ============================================================

  it('should initialize ResetPasswordForm', () => {
    expect(component.ResetPasswordForm).toBeTruthy();

    expect(component.ResetPasswordForm.get('OTP')).toBeTruthy();

    expect(component.ResetPasswordForm.get('NewPassword')).toBeTruthy();

    expect(component.ResetPasswordForm.get('ConfirmPassword')).toBeTruthy();
  });

  // ============================================================
  // PASSWORD MATCH
  // ============================================================

  it('passwordMatch validator returns mismatch when passwords differ', () => {
    const form = component.ResetPasswordForm;

    form.get('NewPassword')?.setValue('Abc@1234');

    form.get('ConfirmPassword')?.setValue('Xyz@1234');

    const result = component.passwordMatch(form);

    expect(result).toEqual({
      passwordMismatch: true,
    });
  });

  // ============================================================
  // PASSWORD MATCH SUCCESS
  // ============================================================

  it('passwordMatch validator returns null when passwords match', () => {
    const form = component.ResetPasswordForm;

    form.get('NewPassword')?.setValue('Abc@1234');

    form.get('ConfirmPassword')?.setValue('Abc@1234');

    const result = component.passwordMatch(form);

    expect(result).toBeNull();
  });

  // ============================================================
  // INVALID FORM
  // ============================================================

  it('marks form touched and returns when invalid', () => {
    spyOn(component.ResetPasswordForm, 'markAllAsTouched');

    component.resetPassword();

    expect(component.ResetPasswordForm.markAllAsTouched).toHaveBeenCalled();

    expect(svc.ResetPassword).not.toHaveBeenCalled();
  });

  // ============================================================
  // MISSING RESET EMAIL
  // ============================================================

  it('alerts and navigates to forgot when resetEmail is missing', () => {
    spyOn(window, 'alert');

    localStorage.removeItem('resetEmail');

    component.ResetPasswordForm.setValue({
      OTP: '123456',

      NewPassword: 'Abc@1234',

      ConfirmPassword: 'Abc@1234',
    });

    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('Email not found. Please try Forgot Password again.');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/forgot-password']);

    expect(svc.ResetPassword).not.toHaveBeenCalled();

    expect(component.isLoading).toBeFalse();
  });

  // ============================================================
  // SUCCESS
  // ============================================================

  it('on success removes resetEmail and navigates to login', () => {
    localStorage.setItem('resetEmail', 'a@a.com');

    component.ResetPasswordForm.setValue({
      OTP: '123456',

      NewPassword: 'Abc@1234',

      ConfirmPassword: 'Abc@1234',
    });

    svc.ResetPassword.and.returnValue(
      of({
        message: 'Password reset successfully',
      } as any),
    );

    spyOn(window, 'alert');

    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('Password reset successfully');

    expect(localStorage.getItem('resetEmail')).toBeNull();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);

    expect(component.isLoading).toBeFalse();
  });

  // ============================================================
  // SERVICE CALL
  // ============================================================

  it('should call ResetPassword with email, OTP and password', () => {
    localStorage.setItem('resetEmail', 'user@example.com');

    component.ResetPasswordForm.setValue({
      OTP: '123456',

      NewPassword: 'Abc@1234',

      ConfirmPassword: 'Abc@1234',
    });

    svc.ResetPassword.and.returnValue(
      of({
        message: 'Password reset successfully',
      } as any),
    );

    spyOn(window, 'alert');

    component.resetPassword();

    expect(svc.ResetPassword).toHaveBeenCalledWith({
      email: 'user@example.com',

      otp: '123456',

      new_password: 'Abc@1234',
    });
  });

  // ============================================================
  // ERROR WITH DETAIL
  // ============================================================

  it('on error alerts with detail', () => {
    localStorage.setItem('resetEmail', 'a@a.com');

    component.ResetPasswordForm.setValue({
      OTP: '123456',

      NewPassword: 'Abc@1234',

      ConfirmPassword: 'Abc@1234',
    });

    svc.ResetPassword.and.returnValue(
      throwError(() => ({
        error: {
          detail: 'Invalid OTP',
        },
      })),
    );

    spyOn(window, 'alert');

    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('Invalid OTP');

    expect(component.isLoading).toBeFalse();
  });

  // ============================================================
  // ERROR WITH MESSAGE
  // ============================================================

  it('on error uses error message when detail is missing', () => {
    localStorage.setItem('resetEmail', 'a@a.com');

    component.ResetPasswordForm.setValue({
      OTP: '123456',

      NewPassword: 'Abc@1234',

      ConfirmPassword: 'Abc@1234',
    });

    svc.ResetPassword.and.returnValue(
      throwError(() => ({
        error: {
          message: 'Password reset failed',
        },
      })),
    );

    spyOn(window, 'alert');

    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('Password reset failed');

    expect(component.isLoading).toBeFalse();
  });

  // ============================================================
  // ERROR WITHOUT DETAIL OR MESSAGE
  // ============================================================

  it('uses default error message when API error has no detail', () => {
    localStorage.setItem('resetEmail', 'a@a.com');

    component.ResetPasswordForm.setValue({
      OTP: '123456',

      NewPassword: 'Abc@1234',

      ConfirmPassword: 'Abc@1234',
    });

    svc.ResetPassword.and.returnValue(throwError(() => ({})));

    spyOn(window, 'alert');

    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('Password Reset Failed');

    expect(component.isLoading).toBeFalse();
  });

  // ============================================================
  // NULL ERROR
  // ============================================================

  it('uses default error message when API error is null', () => {
    localStorage.setItem('resetEmail', 'a@a.com');

    component.ResetPasswordForm.setValue({
      OTP: '123456',

      NewPassword: 'Abc@1234',

      ConfirmPassword: 'Abc@1234',
    });

    svc.ResetPassword.and.returnValue(throwError(() => null));

    spyOn(window, 'alert');

    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('Password Reset Failed');

    expect(component.isLoading).toBeFalse();
  });

  // ============================================================
  // PASSWORD VALIDATION
  // ============================================================

  it('should mark password fields invalid when empty', () => {
    component.ResetPasswordForm.patchValue({
      NewPassword: '',

      ConfirmPassword: '',
    });

    expect(component.ResetPasswordForm.get('NewPassword')?.invalid).toBeTrue();

    expect(component.ResetPasswordForm.get('ConfirmPassword')?.invalid).toBeTrue();
  });

  // ============================================================
  // INVALID PASSWORD FORMAT
  // ============================================================

  it('should reject invalid password format', () => {
    const password = component.ResetPasswordForm.get('NewPassword');

    password?.setValue('password');

    expect(password?.invalid).toBeTrue();
  });

  // ============================================================
  // VALID PASSWORD FORMAT
  // ============================================================

  it('should accept valid password format', () => {
    const password = component.ResetPasswordForm.get('NewPassword');

    password?.setValue('Abc@1234');

    expect(password?.valid).toBeTrue();
  });

  // ============================================================
  // OTP VALIDATION
  // ============================================================

  it('should mark OTP invalid when empty', () => {
    const otp = component.ResetPasswordForm.get('OTP');

    otp?.setValue('');

    expect(otp?.invalid).toBeTrue();
  });

  // ============================================================
  // OTP FORMAT VALIDATION
  // ============================================================

  it('should reject OTP with less than six digits', () => {
    const otp = component.ResetPasswordForm.get('OTP');

    otp?.setValue('12345');

    expect(otp?.invalid).toBeTrue();
  });

  // ============================================================
  // OTP VALID
  // ============================================================

  it('should accept a valid OTP', () => {
    const otp = component.ResetPasswordForm.get('OTP');

    otp?.setValue('123456');

    expect(otp?.valid).toBeTrue();
  });

  // ============================================================
  // NAVIGATION SHOULD NOT HAPPEN ON ERROR
  // ============================================================

  it('should not navigate to login when reset password fails', () => {
    localStorage.setItem('resetEmail', 'a@a.com');

    component.ResetPasswordForm.setValue({
      OTP: '123456',

      NewPassword: 'Abc@1234',

      ConfirmPassword: 'Abc@1234',
    });

    svc.ResetPassword.and.returnValue(
      throwError(() => ({
        error: {
          detail: 'Reset failed',
        },
      })),
    );

    spyOn(window, 'alert');

    component.resetPassword();

    expect(window.alert).toHaveBeenCalledWith('Reset failed');

    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/login']);
  });
});
