import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { SettingsService } from '../../services/settings-service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private readonly fb = inject(FormBuilder);
  private readonly settingsService = inject(SettingsService);

  loading = false;

  successMessage = '';
  errorMessage = '';

  // Success Modal
  showSuccessModal = false;

  // REACTIVE FORM

  passwordForm: FormGroup = this.fb.group(
    {
      old_password: ['', [Validators.required]],

      new_password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/),
        ],
      ],

      confirm_password: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator(),
    },
  );

  // CUSTOM VALIDATOR

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('new_password')?.value;

      const confirmPassword = control.get('confirm_password')?.value;

      if (!newPassword || !confirmPassword) {
        return null;
      }

      return newPassword === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  // GETTERS

  get oldPassword() {
    return this.passwordForm.get('old_password');
  }

  get newPassword() {
    return this.passwordForm.get('new_password');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirm_password');
  }

  // CHANGE PASSWORD

  changePassword(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload = {
      old_password: this.oldPassword?.value,

      new_password: this.newPassword?.value,
    };

    this.settingsService.changePassword(payload).subscribe({
      next: (response) => {
        this.loading = false;

        this.successMessage = response.message;

        this.showSuccessModal = true;

        this.passwordForm.reset();
      },

      error: (err) => {
        this.loading = false;

        this.errorMessage = err?.error?.message ?? 'Unable to change password.';
      },
    });
  }

  // CLOSE MODAL

  closeModal(): void {
    this.showSuccessModal = false;

    this.successMessage = '';
  }
}
