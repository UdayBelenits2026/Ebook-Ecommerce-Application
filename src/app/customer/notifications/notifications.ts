import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-notifications',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './notifications.html',

  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  // SERVICE

  private readonly notificationService = inject(NotificationService);

  private readonly cdr = inject(ChangeDetectorRef);

  // DATA

  notifications: any[] = [];

  // LOADING

  loading = false;

  // ERROR

  errorMessage = '';

  // INIT

  ngOnInit(): void {
    this.loadNotifications();
  }

  // LOAD NOTIFICATIONS

  loadNotifications(): void {
    this.loading = true;

    this.errorMessage = '';

    this.notificationService
      .getUserNotifications()

      .subscribe({
        next: (res) => {
          console.log('NOTIFICATIONS RESPONSE:', res);

          this.notifications = res?.data ?? [];

          console.log('NOTIFICATIONS:', this.notifications);

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('LOAD NOTIFICATIONS ERROR:', err);

          this.notifications = [];

          this.errorMessage =
            err?.error?.message || err?.error?.detail || 'Unable to load notifications.';

          this.loading = false;

          this.cdr.detectChanges();
        },
      });
  }

  // MARK NOTIFICATION AS READ

  markAsRead(notification: any): void {
    // Already read
    if (notification.is_read === true) {
      return;
    }

    console.log('MARKING NOTIFICATION AS READ:', notification.id);

    this.notificationService
      .markUserNotificationRead(notification.id)

      .subscribe({
        next: (res) => {
          console.log('MARK AS READ RESPONSE:', res);

          // --------------------------------------------------
          // IMPORTANT
          // Backend field is is_read
          // --------------------------------------------------

          notification.is_read = true;

          // Update UI immediately

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('MARK AS READ ERROR:', err);

          alert(
            err?.error?.detail || err?.error?.message || 'Unable to mark notification as read.',
          );
        },
      });
  }

  // DELETE NOTIFICATION

  deleteNotification(notification: any): void {
    const confirmed = confirm('Delete this notification?');

    if (!confirmed) {
      return;
    }

    console.log('DELETING NOTIFICATION:', notification.id);

    this.notificationService
      .deleteUserNotification(notification.id)

      .subscribe({
        next: (res) => {
          console.log('DELETE RESPONSE:', res);

          // --------------------------------------------------
          // REMOVE FROM UI IMMEDIATELY
          // --------------------------------------------------

          this.notifications = this.notifications.filter((item) => item.id !== notification.id);

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('DELETE NOTIFICATION ERROR:', err);

          alert(err?.error?.detail || err?.error?.message || 'Unable to delete notification.');
        },
      });
  }

  // MARK ALL AS READ

  markAllAsRead(): void {
    const unreadNotifications = this.notifications.filter(
      (notification) => notification.is_read === false,
    );

    if (!unreadNotifications.length) {
      return;
    }

    unreadNotifications.forEach((notification) => {
      this.notificationService
        .markUserNotificationRead(notification.id)

        .subscribe({
          next: () => {
            notification.is_read = true;

            this.cdr.detectChanges();
          },

          error: (err) => {
            console.error('MARK ALL AS READ ERROR:', err);
          },
        });
    });
  }

  // UNREAD COUNT

  get unreadCount(): number {
    return this.notifications.filter((notification) => notification.is_read === false).length;
  }

  // TRACK BY

  trackById(index: number, item: any): number {
    return item?.id ?? index;
  }
}
