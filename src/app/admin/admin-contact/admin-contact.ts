import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { finalize } from 'rxjs/operators';

import { AdminEnquiryService } from '../../services/admin-enquiry';

import { ContactMessage } from '../../interface/admin-enquiry-interface';

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-contact.html',
  styleUrl: './admin-contact.css',
})
export class AdminContact implements OnInit {
  // SERVICES

  private readonly enquiryService = inject(AdminEnquiryService);

  private readonly cdr = inject(ChangeDetectorRef);

  // DATA

  messages: ContactMessage[] = [];

  selectedMessage: ContactMessage | null = null;

  // STATES

  loading = false;

  error = '';

  deletingIds = new Set<number>();

  readingIds = new Set<number>();

  // INITIALIZATION

  ngOnInit(): void {
    this.loadMessages();
  }

  // LOAD MESSAGES

  loadMessages(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.error = '';

    this.enquiryService
      .getMessages()
      .pipe(
        finalize(() => {
          this.loading = false;

          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          console.log('Contact messages:', res);

          // ===============================================
          // BACKEND ERROR
          // ===============================================

          if (!res?.success) {
            this.messages = [];

            this.error = res?.message || 'Unable to load contact messages.';

            this.cdr.detectChanges();

            return;
          }

          // ===============================================
          // INVALID DATA
          // ===============================================

          if (!Array.isArray(res.data)) {
            this.messages = [];

            this.error = 'Invalid contact messages response.';

            this.cdr.detectChanges();

            return;
          }

          // ===============================================
          // SORT NEWEST FIRST
          // ===============================================

          this.messages = [...res.data].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;

            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

            return dateB - dateA;
          });

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Unable to load messages:', err);

          this.messages = [];

          if (err?.status === 401) {
            this.error = 'Your session has expired. Please login again.';
          } else if (err?.status === 403) {
            this.error = 'You are not authorised to view contact messages.';
          } else if (err?.status === 0) {
            this.error = 'Unable to connect to the server.';
          } else {
            this.error =
              err?.error?.message || err?.error?.detail || 'Unable to load contact messages.';
          }

          this.cdr.detectChanges();
        },
      });
  }

  // OPEN / VIEW MESSAGE

  openMessage(message: ContactMessage): void {
    this.selectedMessage = message;

    // If already read, no API call required
    if (message.is_read) {
      this.cdr.detectChanges();

      return;
    }

    // Automatically mark message as read
    this.markAsRead(message);
  }

  // CLOSE MESSAGE

  closeMessage(): void {
    this.selectedMessage = null;
  }

  // MARK MESSAGE AS READ

  markAsRead(message: ContactMessage): void {
    // Already read
    if (message.is_read) {
      return;
    }

    // Request already running
    if (this.readingIds.has(message.id)) {
      return;
    }

    this.error = '';

    // Create new Set reference
    const ids = new Set(this.readingIds);

    ids.add(message.id);

    this.readingIds = ids;

    this.cdr.detectChanges();

    // =======================================================
    // API CALL
    // =======================================================

    this.enquiryService
      .markAsRead(message.id)
      .pipe(
        finalize(() => {
          const updatedIds = new Set(this.readingIds);

          updatedIds.delete(message.id);

          this.readingIds = updatedIds;

          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          if (!res?.success) {
            this.error = res?.message || 'Unable to mark message as read.';

            this.cdr.detectChanges();

            return;
          }

          // ===============================================
          // UPDATE MESSAGE IN TABLE
          // ===============================================

          this.messages = this.messages.map((item) => {
            if (item.id === message.id) {
              return {
                ...item,
                is_read: true,
              };
            }

            return item;
          });

          // ===============================================
          // UPDATE SELECTED MESSAGE
          // ===============================================

          if (this.selectedMessage?.id === message.id) {
            this.selectedMessage = {
              ...this.selectedMessage,
              is_read: true,
            };
          }

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Unable to mark message as read:', err);

          this.error =
            err?.error?.message || err?.error?.detail || 'Unable to mark message as read.';

          this.cdr.detectChanges();
        },
      });
  }

  // DELETE MESSAGE

  deleteMessage(id: number): void {
    if (this.deletingIds.has(id)) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this message?');

    if (!confirmed) {
      return;
    }

    this.error = '';

    const ids = new Set(this.deletingIds);

    ids.add(id);

    this.deletingIds = ids;

    this.cdr.detectChanges();

    // =======================================================
    // DELETE API
    // =======================================================

    this.enquiryService
      .deleteMessage(id)
      .pipe(
        finalize(() => {
          const updatedIds = new Set(this.deletingIds);

          updatedIds.delete(id);

          this.deletingIds = updatedIds;

          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          if (!res?.success) {
            this.error = res?.message || 'Failed to delete message.';

            this.cdr.detectChanges();

            return;
          }

          // ===============================================
          // REMOVE MESSAGE
          // ===============================================

          this.messages = this.messages.filter((message) => message.id !== id);

          // Close modal if currently selected message deleted
          if (this.selectedMessage?.id === id) {
            this.selectedMessage = null;
          }

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Unable to delete message:', err);

          this.error = err?.error?.message || err?.error?.detail || 'Failed to delete message.';

          this.cdr.detectChanges();
        },
      });
  }

  // REFRESH

  refreshMessages(): void {
    if (this.loading) {
      return;
    }

    this.loadMessages();
  }

  // IS DELETING

  isDeleting(id: number): boolean {
    return this.deletingIds.has(id);
  }

  // IS MARKING READ

  isMarkingRead(id: number): boolean {
    return this.readingIds.has(id);
  }

  // GET INITIAL

  getInitial(name: string | null | undefined): string {
    if (!name?.trim()) {
      return '?';
    }

    return name.trim().charAt(0).toUpperCase();
  }

  // TRACK BY

  trackByMessageId(index: number, message: ContactMessage): number {
    return message.id;
  }

  // TOTAL MESSAGES

  get totalMessages(): number {
    return this.messages.length;
  }

  // UNREAD MESSAGES

  get unreadMessages(): number {
    return this.messages.filter((message) => !message.is_read).length;
  }

  // READ MESSAGES

  get readMessages(): number {
    return this.messages.filter((message) => message.is_read).length;
  }
}
