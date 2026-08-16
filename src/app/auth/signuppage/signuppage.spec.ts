import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Signuppage } from './signuppage';
import { RegisterService } from '../../services/register-service';

describe('Signuppage', () => {
  let component: Signuppage;
  let fixture: ComponentFixture<Signuppage>;

  let registerServiceSpy: jasmine.SpyObj<RegisterService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    registerServiceSpy = jasmine.createSpyObj('RegisterService', [
      'registerUser',
      'sendOtp',
      'verifyOtp',
      'resendOtp',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    /*
     * Default responses.
     * These prevent errors during fixture.detectChanges().
     */

    registerServiceSpy.registerUser.and.returnValue(
      of({
        message: 'Registration successful',
      } as any),
    );

    registerServiceSpy.sendOtp.and.returnValue(
      of({
        message: 'OTP sent',
      } as any),
    );

    registerServiceSpy.verifyOtp.and.returnValue(
      of({
        message: 'Email verified',
      } as any),
    );

    registerServiceSpy.resendOtp.and.returnValue(
      of({
        message: 'OTP resent',
      } as any),
    );

    await TestBed.configureTestingModule({
      imports: [Signuppage],

      providers: [
        {
          provide: RegisterService,
          useValue: registerServiceSpy,
        },

        {
          provide: Router,
          useValue: routerSpy,
        },

        /*
         * RouterLink in the Signuppage HTML
         * requires ActivatedRoute.
         */
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Signuppage);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ============================================================
  // COMPONENT CREATION
  // ============================================================

  it('should create component', () => {
    expect(component).toBeTruthy();

    expect(component.SignUpForm).toBeTruthy();
  });

  // ============================================================
  // PASSWORD MATCH
  // ============================================================

  it('passwordMatch returns mismatch when passwords are different', () => {
    component.SignUpForm.get('password')?.setValue('Abc@1234');

    component.SignUpForm.get('ConfirmPassword')?.setValue('Xyz@1234');

    const result = component.passwordMatch(component.SignUpForm);

    expect(result).toEqual({
      passwordMismatch: true,
    });
  });

  it('passwordMatch returns null when passwords match', () => {
    component.SignUpForm.get('password')?.setValue('Abc@1234');

    component.SignUpForm.get('ConfirmPassword')?.setValue('Abc@1234');

    const result = component.passwordMatch(component.SignUpForm);

    expect(result).toBeNull();
  });

  // ============================================================
  // PASSWORD STRENGTH
  // ============================================================

  it('evaluatePasswordStrength clears strength for empty password', () => {
    component.evaluatePasswordStrength('');

    expect(component.passwordScore).toBe(0);

    expect(component.passwordStrength).toBe('');
  });

  it('evaluatePasswordStrength detects very weak password', () => {
    component.evaluatePasswordStrength('a');

    expect(component.passwordStrength).toBe('Very Weak');
  });

  it('evaluatePasswordStrength calculates password score', () => {
    component.evaluatePasswordStrength('Longer1');

    expect(component.passwordScore).toBeGreaterThan(0);
  });

  it('evaluatePasswordStrength detects strong password', () => {
    component.evaluatePasswordStrength('VeryLongPass1!');

    expect(component.passwordScore).toBe(5);

    expect(component.passwordStrength).toBe('Strong');
  });

  // ============================================================
  // PASSWORD VISIBILITY
  // ============================================================

  it('togglePasswordVisibility toggles password visibility', () => {
    expect(component.showPassword).toBeFalse();

    component.togglePasswordVisibility('password');

    expect(component.showPassword).toBeTrue();

    component.togglePasswordVisibility('password');

    expect(component.showPassword).toBeFalse();
  });

  it('togglePasswordVisibility toggles confirm password visibility', () => {
    expect(component.showConfirmPassword).toBeFalse();

    component.togglePasswordVisibility('confirm');

    expect(component.showConfirmPassword).toBeTrue();

    component.togglePasswordVisibility('confirm');

    expect(component.showConfirmPassword).toBeFalse();
  });

  // ============================================================
  // CLEAR MESSAGES
  // ============================================================

  it('clearMessages clears success and error', () => {
    component.successMessage = 'Success message';

    component.errorMessage = 'Error message';

    component.clearMessages();

    expect(component.successMessage).toBe('');

    expect(component.errorMessage).toBe('');
  });

  // ============================================================
  // SIGNUP
  // ============================================================

  it('signup marks form touched when invalid', () => {
    spyOn(component.SignUpForm, 'markAllAsTouched');

    component.signup();

    expect(component.SignUpForm.markAllAsTouched).toHaveBeenCalled();

    expect(registerServiceSpy.registerUser).not.toHaveBeenCalled();
  });

  it('signup registers user successfully and calls sendOTP', () => {
    spyOn(component, 'sendOTP');

    component.SignUpForm.patchValue({
      FirstName: 'John',

      LastName: 'Doe',

      Email: 'john@example.com',

      Phone: '1234567890',

      password: 'Abc@1234',

      ConfirmPassword: 'Abc@1234',
    });

    registerServiceSpy.registerUser.and.returnValue(
      of({
        message: 'Registration successful',
      } as any),
    );

    component.signup();

    expect(registerServiceSpy.registerUser).toHaveBeenCalledWith({
      full_name: 'John Doe',

      email: 'john@example.com',

      phone: '1234567890',

      password: 'Abc@1234',
    });

    expect(component.isLoading).toBeFalse();

    expect(component.successMessage).toBe('Registration successful');

    expect(component.sendOTP).toHaveBeenCalled();
  });

  it('signup handles registration error', () => {
    component.SignUpForm.patchValue({
      FirstName: 'John',

      LastName: 'Doe',

      Email: 'john@example.com',

      Phone: '1234567890',

      password: 'Abc@1234',

      ConfirmPassword: 'Abc@1234',
    });

    registerServiceSpy.registerUser.and.returnValue(
      throwError(() => ({
        error: {
          detail: 'Email already exists',
        },
      })),
    );

    component.signup();

    expect(component.isLoading).toBeFalse();

    expect(component.errorMessage).toBe('Email already exists');
  });

  // ============================================================
  // SEND OTP
  // ============================================================

  it('sendOTP sends OTP successfully', () => {
    component.SignUpForm.get('Email')?.setValue('john@example.com');

    registerServiceSpy.sendOtp.and.returnValue(
      of({
        message: 'OTP sent successfully',
      } as any),
    );

    component.sendOTP();

    expect(registerServiceSpy.sendOtp).toHaveBeenCalledWith({
      email: 'john@example.com',
    });

    expect(component.otpSent).toBeTrue();

    expect(component.SignUpForm.get('OTP')?.enabled).toBeTrue();

    expect(component.successMessage).toBe('OTP sent successfully');
  });

  it('sendOTP handles error', () => {
    component.SignUpForm.get('Email')?.setValue('john@example.com');

    registerServiceSpy.sendOtp.and.returnValue(
      throwError(() => ({
        error: {
          detail: 'Unable to Send OTP',
        },
      })),
    );

    component.sendOTP();

    expect(component.isLoading).toBeFalse();

    expect(component.errorMessage).toBe('Unable to Send OTP');
  });

  // ============================================================
  // VERIFY OTP
  // ============================================================

  it('verifyOTP marks OTP as touched when invalid', () => {
    /*
     * OTP is disabled initially.
     *
     * Call sendOTP() so that the component itself:
     * 1. enables OTP
     * 2. adds required validator
     * 3. adds 6-digit pattern validator
     */

    component.SignUpForm.get('Email')?.setValue('john@example.com');

    registerServiceSpy.sendOtp.and.returnValue(
      of({
        message: 'OTP sent',
      } as any),
    );

    component.sendOTP();

    const otpControl = component.SignUpForm.get('OTP');

    /*
     * Empty OTP should now be invalid.
     */

    otpControl?.setValue('');

    expect(otpControl?.invalid).toBeTrue();

    /*
     * Spy after making sure the control is invalid.
     */

    spyOn(otpControl!, 'markAsTouched');

    component.verifyOTP();

    expect(otpControl?.markAsTouched).toHaveBeenCalled();

    expect(registerServiceSpy.verifyOtp).not.toHaveBeenCalled();
  });

  it('verifyOTP verifies OTP successfully', () => {
    component.SignUpForm.get('Email')?.setValue('john@example.com');

    /*
     * Use the actual sendOTP() method to configure OTP.
     */

    registerServiceSpy.sendOtp.and.returnValue(
      of({
        message: 'OTP sent',
      } as any),
    );

    component.sendOTP();

    const otpControl = component.SignUpForm.get('OTP');

    otpControl?.setValue('123456');

    expect(otpControl?.valid).toBeTrue();

    registerServiceSpy.verifyOtp.and.returnValue(
      of({
        message: 'Email verified',
      } as any),
    );

    jasmine.clock().install();

    try {
      component.verifyOTP();

      expect(registerServiceSpy.verifyOtp).toHaveBeenCalledWith({
        email: 'john@example.com',

        otp: '123456',
      });

      expect(component.successMessage).toBe('Email verified');

      jasmine.clock().tick(900);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('verifyOTP handles invalid OTP response', () => {
    component.SignUpForm.get('Email')?.setValue('john@example.com');

    registerServiceSpy.sendOtp.and.returnValue(
      of({
        message: 'OTP sent',
      } as any),
    );

    component.sendOTP();

    const otpControl = component.SignUpForm.get('OTP');

    otpControl?.setValue('123456');

    registerServiceSpy.verifyOtp.and.returnValue(
      throwError(() => ({
        error: {
          detail: 'Invalid OTP',
        },
      })),
    );

    component.verifyOTP();

    expect(component.errorMessage).toBe('Invalid OTP');
  });

  // ============================================================
  // RESEND OTP
  // ============================================================

  it('resendOTP sets success message when successful', () => {
    component.SignUpForm.get('Email')?.setValue('john@example.com');

    registerServiceSpy.resendOtp.and.returnValue(
      of({
        message: 'OTP resent successfully',
      } as any),
    );

    component.resendOTP();

    expect(registerServiceSpy.resendOtp).toHaveBeenCalledWith({
      email: 'john@example.com',
    });

    expect(component.successMessage).toBe('OTP resent successfully');
  });

  it('resendOTP handles error', () => {
    component.SignUpForm.get('Email')?.setValue('john@example.com');

    registerServiceSpy.resendOtp.and.returnValue(
      throwError(() => ({
        error: {
          detail: 'Unable to Resend OTP',
        },
      })),
    );

    component.resendOTP();

    expect(component.errorMessage).toBe('Unable to Resend OTP');
  });
});
