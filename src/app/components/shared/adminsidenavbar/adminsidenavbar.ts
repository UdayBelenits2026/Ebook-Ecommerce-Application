import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink, RouterLinkActive } from '@angular/router';

import { SidebarMenu } from '../../../interface/admin-layout-interface';

@Component({
  selector: 'app-admin-side-navbar',

  standalone: true,

  imports: [CommonModule, RouterLink, RouterLinkActive],

  templateUrl: './adminsidenavbar.html',

  styleUrl: './adminsidenavbar.css',
})
export class AdminSideNavbarComponent {
  // SIDEBAR STATE

  @Input()
  isSidebarCollapsed = false;

  // MENU CLICK EVENT

  @Output()
  menuSelected = new EventEmitter<void>();

  // SIDEBAR MENUS

  sidebarMenus: SidebarMenu[] = [
    {
      id: 1,
      title: 'Dashboard',
      icon: 'bi bi-speedometer2',
      route: '/admin/dashboard',
    },

    {
      id: 2,
      title: 'Books',
      icon: 'bi bi-book',
      route: '/admin/books',
    },

    {
      id: 3,
      title: 'Categories',
      icon: 'bi bi-grid',
      route: '/admin/categories',
    },

    {
      id: 4,
      title: 'Users',
      icon: 'bi bi-people',
      route: '/admin/user',
    },

    {
      id: 5,
      title: 'Orders',
      icon: 'bi bi-cart3',
      route: '/admin/orders',
    },

    {
      id: 6,
      title: 'Reviews',
      icon: 'bi bi-star',
      route: '/admin/admin-reviews',
    },

    {
      id: 7,
      title: 'Enquiry',
      icon: 'bi bi-question-circle',
      route: '/admin/enquiry',
    },

    {
      id: 8,
      title: 'Notifications',
      icon: 'bi bi-bell',
      route: '/admin/notifications',
    },
  ];

  // MENU CLICK

  onMenuClick(): void {
    this.menuSelected.emit();
  }
}
