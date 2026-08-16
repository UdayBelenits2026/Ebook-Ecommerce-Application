import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyaccountService } from '../../services/myaccount-service';
import { UserProfile, UpdateProfileRequest } from '../../interface/myaccount-interface';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css',
})
export class MyAccount implements OnInit {
  private readonly accountService = inject(MyaccountService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly apiUrl = 'https://ebook-ecommerce-backend.onrender.com';

  profile: UserProfile | null = null;

  profileImageUrl = 'assets/images/user.png';

  profileData: UpdateProfileRequest = {
    full_name: '',
    phone: '',
  };

  loading = false;
  saving = false;
  uploading = false;

  successMessage = '';
  errorMessage = '';

  selectedFile: File | null = null;

  ngOnInit(): void {
    this.loadProfile();
  }

  // LOAD PROFILE

  loadProfile(): void {
    this.loading = true;

    this.accountService.getProfile().subscribe({
      next: (response) => {
        this.profile = response.data;

        this.profileData = {
          full_name: response.data.full_name,
          phone: response.data.phone ?? '',
        };

        if (response.data.profile_image) {
          this.profileImageUrl =
            (response.data.profile_image.startsWith('http')
              ? response.data.profile_image
              : this.apiUrl + response.data.profile_image) +
            '?t=' +
            Date.now();
        } else {
          this.profileImageUrl = 'assets/images/user.png';
        }

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {
        this.loading = false;

        this.errorMessage = err?.error?.message ?? 'Unable to load profile.';

        this.cdr.detectChanges();
      },
    });
  }

  // SAVE PROFILE

  saveProfile(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.saving = true;

    this.accountService.updateProfile(this.profileData).subscribe({
      next: (response) => {
        this.saving = false;

        this.successMessage = response.message || 'Profile updated successfully.';

        this.loadProfile();

        setTimeout(() => {
          this.successMessage = '';

          this.cdr.detectChanges();
        }, 3000);
      },

      error: (err) => {
        this.saving = false;

        this.errorMessage = err?.error?.message ?? 'Unable to update profile.';
      },
    });
  }

  // FILE SELECT

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];
  }

  // UPLOAD AVATAR

  uploadAvatar(): void {
    if (!this.selectedFile) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    this.uploading = true;

    this.accountService.uploadAvatar(this.selectedFile).subscribe({
      next: (response) => {
        this.uploading = false;

        this.selectedFile = null;

        this.successMessage = response.message || 'Profile image updated successfully.';

        this.loadProfile();

        setTimeout(() => {
          this.successMessage = '';

          this.cdr.detectChanges();
        }, 3000);
      },

      error: (err) => {
        this.uploading = false;

        this.errorMessage = err?.error?.message ?? 'Unable to upload image.';
      },
    });
  }
}
