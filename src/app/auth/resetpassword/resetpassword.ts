import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { LoginService } from '../../services/login-service';

import { ResetPasswordRequest, ResetPasswordResponse } from '../../interface/logininterface';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './resetpassword.html',
  styleUrl: './resetpassword.css',
})
export class Resetpassword {
  ResetPasswordForm!: FormGroup;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.ResetPasswordForm = this.fb.group(
      {
        OTP: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],

        NewPassword: [
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
  }

  // PASSWORD MATCH VALIDATOR

  passwordMatch(control: AbstractControl) {
    const password = control.get('NewPassword')?.value;

    const confirmPassword = control.get('ConfirmPassword')?.value;

    if (password === confirmPassword) {
      return null;
    }

    return {
      passwordMismatch: true,
    };
  }

  // RESET PASSWORD

  resetPassword(): void {
    if (this.ResetPasswordForm.invalid) {
      this.ResetPasswordForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const email = localStorage.getItem('resetEmail');

    if (!email) {
      this.isLoading = false;

      alert('Email not found. Please try Forgot Password again.');

      this.router.navigate(['/forgot-password']);

      return;
    }

    const payload: ResetPasswordRequest = {
      email: email,

      otp: this.ResetPasswordForm.value.OTP,

      new_password: this.ResetPasswordForm.value.NewPassword,
    };

    this.loginService.ResetPassword(payload).subscribe({
      next: (res: ResetPasswordResponse) => {
        this.isLoading = false;

        alert(res.message || 'Password reset successfully');

        localStorage.removeItem('resetEmail');

        this.router.navigate(['/login']);
      },

      error: (err) => {
        this.isLoading = false;

        const message = err?.error?.detail || err?.error?.message || 'Password Reset Failed';

        alert(message);
      },
    });
  }
}
