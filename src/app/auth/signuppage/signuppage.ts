import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { RegisterService } from '../../services/register-service';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../store/auth/auth.selectors';

import {
  RegisterRequest,
  RegisterResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
} from '../../interface/registerinterface';

@Component({
  selector: 'app-signuppage',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signuppage.html',
  styleUrl: './signuppage.css',
})
export class Signuppage {
  SignUpForm!: FormGroup;

  otpSent = false;
  isLoading = false;

  // UI helpers
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = '';
  passwordScore = 0;

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
  ) {
    this.SignUpForm = this.fb.group(
      {
        FirstName: ['', [Validators.required, Validators.minLength(3)]],

        LastName: ['', [Validators.required, Validators.minLength(3)]],

        Email: ['', [Validators.required, Validators.email]],

        Phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],

        OTP: [{ value: '', disabled: true }],

        password: [
          '',
          [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$'),
          ],
        ],

        ConfirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatch,
      },
    );

    // update strength on password changes
    this.SignUpForm.get('password')?.valueChanges?.subscribe((val) => {
      this.evaluatePasswordStrength(val || '');
    });
  }

  // Password Match Validation

  passwordMatch(control: AbstractControl) {
    const password = control.get('password')?.value;

    const confirmPassword = control.get('ConfirmPassword')?.value;

    if (password === confirmPassword) {
      return null;
    }

    return {
      passwordMismatch: true,
    };
  }

  evaluatePasswordStrength(pw: string): void {
    let score = 0;
    if (!pw) {
      this.passwordStrength = '';
      this.passwordScore = 0;
      return;
    }
    // length
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    // uppercase
    if (/[A-Z]/.test(pw)) score++;
    // number
    if (/\d/.test(pw)) score++;
    // special char
    if (/[@$!%*?&]/.test(pw)) score++;

    this.passwordScore = Math.min(score, 5);

    if (this.passwordScore <= 1) this.passwordStrength = 'Very Weak';
    else if (this.passwordScore === 2) this.passwordStrength = 'Weak';
    else if (this.passwordScore === 3) this.passwordStrength = 'Fair';
    else if (this.passwordScore === 4) this.passwordStrength = 'Good';
    else this.passwordStrength = 'Strong';
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // ==========================
  // Register User
  // ==========================

  signup(): void {
    this.clearMessages();

    if (this.SignUpForm.invalid) {
      this.SignUpForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const form = this.SignUpForm.getRawValue();

    const payload: RegisterRequest = {
      full_name: `${form.FirstName} ${form.LastName}`,

      email: form.Email,

      phone: form.Phone,

      password: form.password,
    };

    this.registerService.registerUser(payload).subscribe({
      next: (res: RegisterResponse) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Registration successful.';

        // proceed to OTP step
        this.sendOTP();
      },

      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.detail || err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }

  // Send OTP

  sendOTP(): void {
    const payload: SendOtpRequest = {
      email: this.SignUpForm.get('Email')?.value,
    };

    this.registerService.sendOtp(payload).subscribe({
      next: (res: SendOtpResponse) => {
        this.isLoading = false;

        this.otpSent = true;

        this.SignUpForm.get('OTP')?.enable();

        this.SignUpForm.get('OTP')?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{6}$'),
        ]);

        this.SignUpForm.get('OTP')?.updateValueAndValidity();

        this.successMessage = res.message || 'OTP sent to your email.';
      },

      error: (err) => {
        this.isLoading = false;

        this.errorMessage = err.error?.detail || 'Unable to Send OTP';
      },
    });
  }

  // Verify OTP
  verifyOTP(): void {
    this.clearMessages();

    if (this.SignUpForm.get('OTP')?.invalid) {
      this.SignUpForm.get('OTP')?.markAsTouched();

      return;
    }

    const payload: VerifyOtpRequest = {
      email: this.SignUpForm.get('Email')?.value,

      otp: this.SignUpForm.get('OTP')?.value,
    };

    this.registerService.verifyOtp(payload).subscribe({
      next: (res: VerifyOtpResponse) => {
        this.successMessage = res.message || 'Email verified.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 900);
      },

      error: (err) => {
        this.errorMessage = err.error?.detail || 'Invalid OTP';
      },
    });
  }

  // Resend OTP

  resendOTP(): void {
    const payload: ResendOtpRequest = {
      email: this.SignUpForm.get('Email')?.value,
    };

    this.registerService.resendOtp(payload).subscribe({
      next: (res: ResendOtpResponse) => {
        this.successMessage = res.message || 'OTP resent.';
      },

      error: (err) => {
        this.errorMessage = err.error?.detail || 'Unable to Resend OTP';
      },
    });
  }
}
