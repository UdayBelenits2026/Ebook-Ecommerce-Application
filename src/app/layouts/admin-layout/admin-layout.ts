import { Component, HostListener, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { AdminMainNavbarComponent } from '../../components/shared/adminmainnavbar/adminmainnavbar';

import { AdminSideNavbarComponent } from '../../components/shared/adminsidenavbar/adminsidenavbar';

@Component({
  selector: 'app-admin-layout',

  standalone: true,

  imports: [RouterOutlet, AdminMainNavbarComponent, AdminSideNavbarComponent],

  templateUrl: './admin-layout.html',

  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  // SIDEBAR STATE

  isSidebarCollapsed = signal(false);

  // TOGGLE SIDEBAR

  toggleSidebar(): void {
    this.isSidebarCollapsed.update((value) => !value);
  }

  // MENU SELECTED

  closeSidebarOnMobile(): void {
    if (window.innerWidth <= 768) {
      this.isSidebarCollapsed.set(false);
    }
  }

  // WINDOW RESIZE

  @HostListener('window:resize')
  onWindowResize(): void {
    /*
      If user changes from mobile to desktop,
      make sure the sidebar is restored.
    */

    if (window.innerWidth > 768) {
      /*
        Keep desktop sidebar expanded
        after coming from mobile.
      */

      if (this.isSidebarCollapsed()) {
        this.isSidebarCollapsed.set(false);
      }
    }
  }
}
