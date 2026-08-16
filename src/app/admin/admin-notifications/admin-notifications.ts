import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css'
})
export class AdminNotifications implements OnInit {

  private readonly notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  notifications: any[] = [];
  loading = false;
  errorMessage = '';

  // form
  title = '';
  message = '';
  type = 'ANNOUNCEMENT';

  types = [
    'ANNOUNCEMENT',
    'OFFER',
    'ORDER_UPDATE',
    'NEW_ARRIVAL',
    'DISCOUNT'
  ];

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getAdminNotifications().subscribe({
      next: (res) => {
        this.notifications = (res?.data ?? []) as any[];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err?.error?.message ?? 'Unable to load notifications.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createNotification(): void {
    if (!this.title.trim() || !this.message.trim()) {
      alert('Please provide title and message');
      return;
    }

    const payload = {
      title: this.title,
      message: this.message,
      type: this.type,
      // backend expects fields; keep as-is
    };

    this.notificationService.createAdminNotification(payload).subscribe({
      next: () => {
        this.title = '';
        this.message = '';
        this.type = 'ANNOUNCEMENT';
        this.loadNotifications();
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message ?? 'Unable to create notification');
      }
    });
  }

  deleteNotification(n: any): void {
    const confirmed = confirm('Delete notification?');
    if (!confirmed) return;
    this.notificationService.deleteAdminNotification(n.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(i => i.id !== n.id);
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message ?? 'Unable to delete notification');
      }
    });
  }

  trackById(index: number, item: any) {
    return item?.id ?? index;
  }

}