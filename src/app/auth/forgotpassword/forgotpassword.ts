import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { LoginService } from '../../services/login-service';
import { ForgotPasswordRequest, ForgotPasswordResponse } from '../../interface/logininterface';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.css',
})
export class Forgotpassword {
  ForgotPasswordForm!: FormGroup;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.ForgotPasswordForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
    });
  }

  sendOtp() {
    if (this.ForgotPasswordForm.invalid) {
      this.ForgotPasswordForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const payload: ForgotPasswordRequest = {
      email: this.ForgotPasswordForm.value.Email,
    };

    this.loginService.ForgotPass(payload).subscribe({
      next: (res: ForgotPasswordResponse) => {
        this.isLoading = false;

        alert(res.message);

        localStorage.setItem('resetEmail', payload.email);

        this.router.navigate(['/reset-password']);
      },

      error: (err) => {
        this.isLoading = false;

        alert(err.error.detail || 'Failed to send OTP');
      },
    });
  }
}
