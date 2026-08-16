import { Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AdminProfileService } from '../../services/adminprofile-service';

import { AdminProfile } from '../../interface/admin-profile-interface';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css',
})
export class AdminProfileComponent implements OnInit {
  private readonly profileService = inject(AdminProfileService);

  // Signals

  profile = signal<AdminProfile | null>(null);

  fullName = signal('');

  phone = signal('');

  profileImage = signal('');

  isLoading = signal(false);

  isSaving = signal(false);

  successMessage = signal('');

  errorMessage = signal('');

  // Init

  ngOnInit(): void {
    this.loadProfile();
  }

  // Load Profile

  loadProfile(): void {
    this.isLoading.set(true);

    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.profile.set(response.data);

        this.fullName.set(response.data.full_name);

        this.phone.set(response.data.phone ?? '');

        this.profileImage.set(
          response.data.profile_image ? `https://ebook-ecommerce-backend.onrender.com${response.data.profile_image}` : '',
        );

        this.isLoading.set(false);
      },

      error: () => {
        this.errorMessage.set('Unable to load profile');

        this.isLoading.set(false);
      },
    });
  }

  // Save Profile

  saveProfile(): void {
    this.isSaving.set(true);

    this.successMessage.set('');

    this.errorMessage.set('');

    this.profileService
      .updateProfile({
        full_name: this.fullName(),

        phone: this.phone(),
      })
      .subscribe({
        next: (response) => {
          this.successMessage.set(response.message);

          this.profile.set(response.data);

          this.isSaving.set(false);
        },

        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to update profile');

          this.isSaving.set(false);
        },
      });
  }

  // Upload Image

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    this.profileService.uploadImage(file).subscribe({
      next: () => {
        this.loadProfile();
      },

      error: () => {
        this.errorMessage.set('Failed to upload image');
      },
    });
  }
}
