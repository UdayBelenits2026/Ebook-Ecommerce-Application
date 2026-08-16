import { Component, HostListener, OnDestroy, OnInit, inject, signal, effect } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink, RouterLinkActive, Router } from '@angular/router';

import { map, of, Subject, Subscription } from 'rxjs';

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';

import { AuthService } from '../../../services/auth-services';
import { BookService } from '../../../services/bookservices';
import { CartService } from '../../../services/cart-service';
import { WishlistService } from '../../../services/wishlist-service';
import { NotificationService } from '../../../services/notification-service';
import { MyaccountService } from '../../../services/myaccount-service';

interface ProfileMenuItem {
  label: string;
  route?: string;
  action?: 'logout';
}

@Component({
  selector: 'app-navbar',
  standalone: true,

  imports: [CommonModule, RouterLink, RouterLinkActive],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isProfileOpen = signal(false);

  profileImageUrl = signal<string>('');

  private readonly accountService = inject(MyaccountService);

  cartCount = signal(0);

  wishlistCount = signal(0);

  private readonly cartService = inject(CartService);

  private readonly wishlistService = inject(WishlistService);

  private cartCountSubscription?: Subscription;

  private wishlistCountSubscription?: Subscription;

  private cartChangedSubscription?: Subscription;

  private wishlistChangedSubscription?: Subscription;

  private readonly userProfileMenu: ProfileMenuItem[] = [
    {
      label: 'My Account',
      route: '/customer/my-account',
    },

    {
      label: 'My Orders',
      route: '/customer/my-orders',
    },

    {
      label: 'Settings',
      route: '/customer/settings',
    },

    {
      label: 'Logout',
      action: 'logout',
    },
  ];

  private readonly adminProfileMenu: ProfileMenuItem[] = [
    {
      label: 'Dashboard',
      route: '/admin/dashboard',
    },

    {
      label: 'Logout',
      action: 'logout',
    },
  ];

  isNotificationsOpen = signal(false);

  notifications = signal<any[]>([]);

  unreadCount = signal(0);

  private readonly notificationService = inject(NotificationService);

  isMobileMenuOpen = signal(false);

  isSearchOpen = signal(false);

  searchQuery = signal('');

  searchResults = signal<any[]>([]);

  isSearchDropdownOpen = signal(false);

  searchLoading = signal(false);

  searchError = signal('');

  private readonly searchTerms = new Subject<string>();

  private searchSubscription?: Subscription;

  private readonly bookService = inject(BookService);

  private readonly router = inject(Router);

  constructor(public auth: AuthService) {
    // Auth state
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.cartService.refreshCartCount();

        this.wishlistService.refreshWishlistCount();

        this.loadNotifications();

        this.loadUserProfile();
      } else {
        this.cartService.resetCartCount();

        this.wishlistService.resetWishlistCount();

        this.cartCount.set(0);

        this.wishlistCount.set(0);

        this.notifications.set([]);

        this.unreadCount.set(0);

        this.profileImageUrl.set('');
      }
    });

    // Mobile body scroll
    effect(() => {
      if (this.isMobileMenuOpen()) {
        try {
          document.body.classList.add('nav-open');
        } catch (error) {}
      } else {
        try {
          document.body.classList.remove('nav-open');
        } catch (error) {}
      }
    });

    // Search focus
    effect(() => {
      if (this.isSearchOpen()) {
        setTimeout(() => {
          const element = document.getElementById('public-search-input') as HTMLInputElement | null;

          if (element) {
            element.focus();
          }
        }, 50);
      }
    });
  }

  // ON INIT

  ngOnInit(): void {
    this.cartCountSubscription = this.cartService.cartCount$.subscribe((count) => {
      this.cartCount.set(count);
    });

    this.wishlistCountSubscription = this.wishlistService.wishlistCount$.subscribe((count) => {
      this.wishlistCount.set(count);
    });

    this.cartChangedSubscription = this.cartService.cartChanged.subscribe(() => {
      if (this.auth.isLoggedIn()) {
        this.cartService.refreshCartCount();
      }
    });

    this.wishlistChangedSubscription = this.wishlistService.wishlistChanged.subscribe(() => {
      if (this.auth.isLoggedIn()) {
        this.wishlistService.refreshWishlistCount();
      }
    });

    // SEARCH RXJS

    this.searchSubscription = this.searchTerms
      .pipe(
        map((value) => value.trim()),

        debounceTime(250),

        distinctUntilChanged(),

        tap((value) => {
          const isEmpty = value === '';

          this.searchLoading.set(!isEmpty);

          this.searchError.set('');

          if (isEmpty) {
            this.searchResults.set([]);

            this.isSearchDropdownOpen.set(false);
          }
        }),

        filter((value) => value !== ''),

        switchMap((value) =>
          this.bookService.getBooks(1, 7, value).pipe(
            catchError((error) => {
              console.error('Search failed', error);

              this.searchError.set('Unable to load search results.');

              this.searchResults.set([]);

              this.searchLoading.set(false);

              return of({
                items: [],
              });
            }),
          ),
        ),
      )

      .subscribe((response) => {
        this.searchResults.set(Array.isArray(response.items) ? response.items : []);

        this.searchLoading.set(false);

        this.isSearchDropdownOpen.set(true);
      });
  }

  // NOTIFICATIONS

  loadNotifications(): void {
    if (!this.auth.isUserLoggedIn()) {
      return;
    }

    this.notificationService.getUserNotifications().subscribe({
      next: (response) => {
        const list = (response?.data ?? []) as any[];

        this.notifications.set(list);

        const unread = list.filter((n) => !n.read).length;

        this.unreadCount.set(unread);
      },

      error: (error) => {
        console.error('Unable to load notifications', error);
      },
    });
  }

  toggleNotifications(event?: Event): void {
    event?.stopPropagation();

    this.isNotificationsOpen.update((value) => !value);
  }

  markAsRead(notification: any): void {
    if (!notification || notification.read) {
      return;
    }

    this.notificationService.markUserNotificationRead(notification.id).subscribe({
      next: () => {
        notification.read = true;

        const unread = this.notifications().filter((n) => !n.read).length;

        this.unreadCount.set(unread);
      },

      error: (error) => {
        console.error('Unable to mark as read', error);
      },
    });
  }

  deleteNotification(notification: any): void {
    const confirmed = confirm('Delete this notification?');

    if (!confirmed) {
      return;
    }

    this.notificationService.deleteUserNotification(notification.id).subscribe({
      next: () => {
        const updated = this.notifications().filter((n) => n.id !== notification.id);

        this.notifications.set(updated);

        const unread = updated.filter((n) => !n.read).length;

        this.unreadCount.set(unread);
      },

      error: (error) => {
        console.error('Unable to delete notification', error);
      },
    });
  }

  // PROFILE

  loadUserProfile(): void {
    if (!this.auth.isUserLoggedIn()) {
      return;
    }

    this.accountService.getProfile().subscribe({
      next: (response) => {
        const data = response?.data;

        if (data && data.profile_image) {
          const apiUrl = 'http://127.0.0.1:8000';

          const url = data.profile_image.startsWith('http')
            ? data.profile_image
            : apiUrl + data.profile_image;

          this.profileImageUrl.set(url + '?t=' + Date.now());
        } else {
          this.profileImageUrl.set('');
        }
      },

      error: (error) => {
        console.error('Unable to load user profile', error);

        this.profileImageUrl.set('');
      },
    });
  }

  toggleProfileMenu(event?: Event): void {
    event?.stopPropagation();

    this.isProfileOpen.update((value) => !value);
  }

  closeProfileMenu(): void {
    this.isProfileOpen.set(false);
  }

  // MOBILE MENU

  toggleMobileMenu(event?: Event): void {
    event?.stopPropagation();

    if (!this.isMobileMenuOpen() && this.isSearchOpen()) {
      this.isSearchOpen.set(false);
    }

    this.isMobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  // SEARCH

  toggleSearch(event?: Event): void {
    event?.stopPropagation();

    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }

    this.isSearchOpen.update((value) => !value);
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);

    this.searchTerms.next(value);
  }

  onSearchSubmit(event?: Event): void {
    event?.preventDefault();

    event?.stopPropagation();

    const query = this.searchQuery().trim();

    if (!query) {
      return;
    }

    this.isSearchDropdownOpen.set(false);

    this.isSearchOpen.set(false);

    this.router.navigate(['/books'], {
      queryParams: {
        search: query,
      },
    });
  }

  selectSearchResult(book: any): void {
    this.isSearchDropdownOpen.set(false);

    this.isSearchOpen.set(false);

    this.router.navigate(['/book-details', book.id]);
  }

  closeSearch(): void {
    this.isSearchOpen.set(false);

    this.isSearchDropdownOpen.set(false);
  }

  // DOCUMENT CLICK

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement | null;

    if (!target || !target.closest) {
      this.closeProfileMenu();

      return;
    }

    const clickedProfile = !!target.closest('[data-profile]');

    const clickedNotifications = !!target.closest('[data-notifications]');

    const clickedMobileNav =
      !!target.closest('[data-mobile-nav]') || !!target.closest('.mobile-menu-btn');

    if (!clickedProfile) {
      this.closeProfileMenu();
    }

    if (!clickedNotifications) {
      this.isNotificationsOpen.set(false);
    }

    if (!clickedMobileNav) {
      this.isMobileMenuOpen.set(false);
    }

    const clickedSearch = !!target.closest('.search-box') || !!target.closest('.search-toggle-btn');

    if (!clickedSearch) {
      this.isSearchOpen.set(false);

      this.isSearchDropdownOpen.set(false);
    }
  }

  // LOGOUT

  logout(): void {
    this.closeProfileMenu();

    this.auth.logout();
  }

  // PROFILE HELPERS

  get profileMenuItems(): ProfileMenuItem[] {
    if (this.isAdminUser) {
      return this.adminProfileMenu;
    }

    if (this.isStandardUser) {
      return this.userProfileMenu;
    }

    return [
      {
        label: 'Logout',
        action: 'logout',
      },
    ];
  }

  get profileDisplayName(): string {
    return this.auth.getFullName() || this.auth.getEmail() || 'User';
  }

  private get normalizedRole(): string | null {
    return this.auth.getRole()?.toUpperCase() ?? null;
  }

  get isAdminUser(): boolean {
    return this.normalizedRole === 'ADMIN';
  }

  get isStandardUser(): boolean {
    return this.normalizedRole === 'USER' || this.normalizedRole === 'CUSTOMER';
  }

  // TRACK BY

  trackByNotification(index: number, item: any): any {
    return item?.id ?? index;
  }

  // DESTROY

  ngOnDestroy(): void {
    this.cartCountSubscription?.unsubscribe();

    this.wishlistCountSubscription?.unsubscribe();

    this.cartChangedSubscription?.unsubscribe();

    this.wishlistChangedSubscription?.unsubscribe();

    this.searchSubscription?.unsubscribe();

    try {
      document.body.classList.remove('nav-open');
    } catch (error) {}
  }
}
