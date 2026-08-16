import { Component, EventEmitter, Input, Output, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

import { AdminService } from '../../../services/admin-layout-service';
import { AuthService } from '../../../services/auth-services';
import { LoginService } from '../../../services/login-service';

import { AdminProfile } from '../../../interface/admin-layout-interface';

@Component({
  selector: 'app-admin-main-navbar',

  standalone: true,

  imports: [CommonModule, RouterModule],

  templateUrl: './adminmainnavbar.html',

  styleUrl: './adminmainnavbar.css',
})
export class AdminMainNavbarComponent implements OnInit {
  // SIDEBAR STATE

  @Input()
  isSidebarCollapsed = false;

  @Output()
  sidebarToggle = new EventEmitter<void>();

  // SERVICES

  private readonly adminService = inject(AdminService);

  private readonly authService = inject(AuthService);

  private readonly loginService = inject(LoginService);

  // ADMIN PROFILE

  adminProfile = signal<AdminProfile | null>(null);

  isLoading = signal(false);

  errorMessage = signal('');

  // PROFILE DROPDOWN

  isProfileMenuOpen = signal(false);

  // INITIALIZATION

  ngOnInit(): void {
    this.loadAdminProfile();
  }

  // LOAD ADMIN PROFILE

  loadAdminProfile(): void {
    this.isLoading.set(true);

    this.errorMessage.set('');

    this.adminService.getProfile().subscribe({
      next: (response) => {
        this.adminProfile.set(response.data);

        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Unable to load admin profile', error);

        this.errorMessage.set(error.error?.message || 'Unable to load profile');

        this.isLoading.set(false);
      },
    });
  }

  // TOGGLE SIDEBAR

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  // PROFILE MENU

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update((value) => !value);
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  // LOGOUT

  logout(): void {
    this.closeProfileMenu();

    this.loginService.LogoutUser().subscribe({
      next: () => {
        this.authService.logout();
      },

      error: () => {
        // Clear local session even
        // if backend logout fails.

        this.authService.logout();
      },
    });
  }
}
