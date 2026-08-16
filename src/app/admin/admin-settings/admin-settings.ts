import {
  Component,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AdminProfileService } from '../../services/adminprofile-service'
@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css'
})
export class AdminSettings {

  private readonly profileService = inject(AdminProfileService);

  oldPassword = signal('');

  newPassword = signal('');

  confirmPassword = signal('');

  isLoading = signal(false);

  successMessage = signal('');

  errorMessage = signal('');

  showOldPassword = signal(false);

  showNewPassword = signal(false);

  showConfirmPassword = signal(false);

  changePassword(): void {

    this.successMessage.set('');

    this.errorMessage.set('');

    if (
      !this.oldPassword() ||
      !this.newPassword() ||
      !this.confirmPassword()
    ) {

      this.errorMessage.set('All fields are required');

      return;

    }

    if (this.newPassword() !== this.confirmPassword()) {

      this.errorMessage.set('Passwords do not match');

      return;

    }

    this.isLoading.set(true);

    this.profileService.changePassword({

      old_password: this.oldPassword(),

      new_password: this.newPassword()

    }).subscribe({

      next: (response) => {

        this.successMessage.set(response.message);

        this.oldPassword.set('');

        this.newPassword.set('');

        this.confirmPassword.set('');

        this.isLoading.set(false);

      },

      error: (err) => {

        this.errorMessage.set(

          err.error?.message ||

          'Unable to change password'

        );

        this.isLoading.set(false);

      }

    });

  }

}