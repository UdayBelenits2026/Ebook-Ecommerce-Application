import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { Forgotpassword } from './forgotpassword';
import { LoginService } from '../../services/login-service';
import { Router, ActivatedRoute } from '@angular/router';

describe('Forgotpassword', () => {
  let component: Forgotpassword;
  let fixture: ComponentFixture<Forgotpassword>;

  let svc: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // ---------------------------------------------
    // Login Service Spy
    // ---------------------------------------------

    svc = jasmine.createSpyObj('LoginService', ['ForgotPass']);

    // ---------------------------------------------
    // Router Spy
    // ---------------------------------------------

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // ---------------------------------------------
    // Default service response
    // ---------------------------------------------

    svc.ForgotPass.and.returnValue(
      of({
        message: 'sent',
      } as any),
    );

    await TestBed.configureTestingModule({
      imports: [Forgotpassword],

      providers: [
        {
          provide: LoginService,
          useValue: svc,
        },

        {
          provide: Router,
          useValue: routerSpy,
        },

        // -----------------------------------------
        // IMPORTANT
        //
        // Forgotpassword template contains
        // routerLink.
        //
        // RouterLink internally requires
        // ActivatedRoute.
        // -----------------------------------------

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},

            params: of({}),

            queryParams: of({}),

            paramMap: of(null),

            queryParamMap: of(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Forgotpassword);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ============================================================
  // CREATE
  // ============================================================

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // ============================================================
  // FORM
  // ============================================================

  it('should initialize ForgotPasswordForm', () => {
    expect(component.ForgotPasswordForm).toBeTruthy();

    expect(component.ForgotPasswordForm.get('Email')).toBeTruthy();
  });

  // ============================================================
  // INVALID FORM
  // ============================================================

  it('marks form touched when invalid', () => {
    spyOn(component.ForgotPasswordForm, 'markAllAsTouched');

    component.sendOtp();

    expect(component.ForgotPasswordForm.markAllAsTouched).toHaveBeenCalled();

    expect(svc.ForgotPass).not.toHaveBeenCalled();
  });

  // ============================================================
  // VALID FORM - SUCCESS
  // ============================================================

  it('successful ForgotPass alerts, stores email and navigates', () => {
    component.ForgotPasswordForm.setValue({
      Email: 'a@a.com',
    });

    svc.ForgotPass.and.returnValue(
      of({
        message: 'sent',
      } as any),
    );

    spyOn(window, 'alert');

    localStorage.removeItem('resetEmail');

    component.sendOtp();

    // ---------------------------------------------
    // Service should be called
    // ---------------------------------------------

    expect(svc.ForgotPass).toHaveBeenCalled();

    // ---------------------------------------------
    // Alert
    // ---------------------------------------------

    expect(window.alert).toHaveBeenCalledWith('sent');

    // ---------------------------------------------
    // Email stored
    // ---------------------------------------------

    expect(localStorage.getItem('resetEmail')).toBe('a@a.com');

    // ---------------------------------------------
    // Navigation
    // ---------------------------------------------

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/reset-password']);
  });

  // ============================================================
  // SERVICE ERROR
  // ============================================================

  it('error path alerts with error detail', () => {
    component.ForgotPasswordForm.setValue({
      Email: 'b@b.com',
    });

    svc.ForgotPass.and.returnValue(
      throwError(() => ({
        error: {
          detail: 'err',
        },
      })),
    );

    spyOn(window, 'alert');

    component.sendOtp();

    expect(window.alert).toHaveBeenCalledWith('err');
  });

  // ============================================================
  // SERVICE ERROR WITHOUT DETAIL
  // ============================================================

  it('error path should use default error message when detail is missing', () => {
    component.ForgotPasswordForm.setValue({
      Email: 'c@c.com',
    });

    svc.ForgotPass.and.returnValue(
      throwError(() => ({
        error: {},
      })),
    );

    spyOn(window, 'alert');

    component.sendOtp();

    expect(window.alert).toHaveBeenCalled();
  });

  // ============================================================
  // VALID EMAIL
  // ============================================================

  it('should accept a valid email', () => {
    const emailControl = component.ForgotPasswordForm.get('Email');

    emailControl?.setValue('test@example.com');

    expect(emailControl?.valid).toBeTrue();
  });

  // ============================================================
  // INVALID EMAIL
  // ============================================================

  it('should reject an invalid email', () => {
    const emailControl = component.ForgotPasswordForm.get('Email');

    emailControl?.setValue('invalid-email');

    expect(emailControl?.invalid).toBeTrue();
  });

  // ============================================================
  // EMPTY EMAIL
  // ============================================================

  it('should reject empty email', () => {
    const emailControl = component.ForgotPasswordForm.get('Email');

    emailControl?.setValue('');

    expect(emailControl?.invalid).toBeTrue();
  });

  // ============================================================
  // SERVICE NOT CALLED FOR INVALID FORM
  // ============================================================

  it('should not call ForgotPass when form is invalid', () => {
    component.ForgotPasswordForm.setValue({
      Email: '',
    });

    component.sendOtp();

    expect(svc.ForgotPass).not.toHaveBeenCalled();
  });

  // ============================================================
  // SERVICE CALLED WITH EMAIL
  // ============================================================

  it('should call ForgotPass with entered email', () => {
    component.ForgotPasswordForm.setValue({
      Email: 'user@example.com',
    });

    svc.ForgotPass.and.returnValue(
      of({
        message: 'OTP sent',
      } as any),
    );

    spyOn(window, 'alert');

    component.sendOtp();

    expect(svc.ForgotPass).toHaveBeenCalledWith({
      email: 'user@example.com',
    });
  });
});
