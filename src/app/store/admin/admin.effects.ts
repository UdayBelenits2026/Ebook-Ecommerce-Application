import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardService } from '../../services/admin-dashboard-service';
import { AdminBooksService } from '../../services/admin-book-service';
import { AdminUsersService } from '../../services/admin-users-service';
import { AdminOrdersService } from '../../services/admin-orders-service';
import { AdminReviewService } from '../../services/admin-review-service';
import { AdminEnquiryService } from '../../services/admin-enquiry';
import { NotificationService } from '../../services/notification-service';
import { AdminService } from '../../services/admin-layout-service';
import * as AdminActions from './admin.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AdminEffects {
  private actions$ = inject(Actions);
  private dashboardService = inject(DashboardService);
  private adminBooksService = inject(AdminBooksService);
  private adminUsersService = inject(AdminUsersService);
  private adminOrdersService = inject(AdminOrdersService);
  private adminReviewService = inject(AdminReviewService);
  private adminEnquiryService = inject(AdminEnquiryService);
  private notificationService = inject(NotificationService);
  private adminService = inject(AdminService);

  // Dashboard
  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadDashboard),
      switchMap(() =>
        this.dashboardService.getDashboardStatistics().pipe(
          map((response) => AdminActions.loadDashboardSuccess({ stats: response.data })),
          catchError((error) =>
            of(AdminActions.loadDashboardFailure({
              error: error?.message ?? error?.error?.message ?? 'Failed to load dashboard.'
            }))
          )
        )
      )
    )
  );

  // Admin Books
  loadAdminBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminBooks),
      switchMap(() =>
        this.adminBooksService.getBooks().pipe(
          map((books) => AdminActions.loadAdminBooksSuccess({ books })),
          catchError((error) =>
            of(AdminActions.loadAdminBooksFailure({
              error: error?.error?.message ?? 'Failed to load books.'
            }))
          )
        )
      )
    )
  );

  createAdminBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.createAdminBook),
      mergeMap(({ payload, coverImage }) =>
        this.adminBooksService.createBook(payload, coverImage).pipe(
          map(() => AdminActions.loadAdminBooks()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to create book.'
            }))
          )
        )
      )
    )
  );

  updateAdminBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.updateAdminBook),
      mergeMap(({ id, payload }) =>
        this.adminBooksService.updateBook(id, payload).pipe(
          map(() => AdminActions.loadAdminBooks()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to update book.'
            }))
          )
        )
      )
    )
  );

  deleteAdminBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.deleteAdminBook),
      mergeMap(({ id }) =>
        this.adminBooksService.deleteBook(id).pipe(
          map(() => AdminActions.loadAdminBooks()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to delete book.'
            }))
          )
        )
      )
    )
  );

  // Admin Users
  loadAdminUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminUsers),
      switchMap(() =>
        this.adminUsersService.getUsers().pipe(
          map((response) => AdminActions.loadAdminUsersSuccess({ users: response.data || [] })),
          catchError((error) =>
            of(AdminActions.loadAdminUsersFailure({
              error: error?.error?.message ?? 'Failed to load users.'
            }))
          )
        )
      )
    )
  );

  updateUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.updateUserStatus),
      mergeMap(({ id, status }) =>
        this.adminUsersService.updateStatus(id, status).pipe(
          map(() => AdminActions.loadAdminUsers()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to update user status.'
            }))
          )
        )
      )
    )
  );

  deleteAdminUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.deleteAdminUser),
      mergeMap(({ id }) =>
        this.adminUsersService.deleteUser(id).pipe(
          map(() => AdminActions.loadAdminUsers()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to delete user.'
            }))
          )
        )
      )
    )
  );

  // Admin Orders
  loadAdminOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminOrders),
      switchMap(() =>
        this.adminOrdersService.getOrders().pipe(
          map((response) => AdminActions.loadAdminOrdersSuccess({ orders: response.data || [] })),
          catchError((error) =>
            of(AdminActions.loadAdminOrdersFailure({
              error: error?.error?.message ?? 'Failed to load orders.'
            }))
          )
        )
      )
    )
  );

  updateOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.updateOrderStatus),
      mergeMap(({ id, body }) =>
        this.adminOrdersService.updateStatus(id, body).pipe(
          map(() => AdminActions.loadAdminOrders()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to update order status.'
            }))
          )
        )
      )
    )
  );

  updateOrderTracking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.updateOrderTracking),
      mergeMap(({ id, body }) =>
        this.adminOrdersService.updateTracking(id, body).pipe(
          map(() => AdminActions.loadAdminOrders()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to update order tracking.'
            }))
          )
        )
      )
    )
  );

  // Admin Reviews
  loadAdminReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminReviews),
      switchMap(() =>
        this.adminReviewService.getReviews().pipe(
          map((response) => AdminActions.loadAdminReviewsSuccess({ reviews: response.data || [] })),
          catchError((error) =>
            of(AdminActions.loadAdminReviewsFailure({
              error: error?.error?.message ?? 'Failed to load reviews.'
            }))
          )
        )
      )
    )
  );

  deleteAdminReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.deleteAdminReview),
      mergeMap(({ id }) =>
        this.adminReviewService.deleteReview(id).pipe(
          map(() => AdminActions.loadAdminReviews()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to delete review.'
            }))
          )
        )
      )
    )
  );

  // Admin Enquiries
  loadAdminEnquiries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminEnquiries),
      switchMap(() =>
        this.adminEnquiryService.getMessages().pipe(
          map((response) => AdminActions.loadAdminEnquiriesSuccess({ enquiries: response.data || [] })),
          catchError((error) =>
            of(AdminActions.loadAdminEnquiriesFailure({
              error: error?.error?.message ?? 'Failed to load enquiries.'
            }))
          )
        )
      )
    )
  );

  markEnquiryRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.markEnquiryRead),
      mergeMap(({ id }) =>
        this.adminEnquiryService.markAsRead(id).pipe(
          map(() => AdminActions.loadAdminEnquiries()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to mark enquiry as read.'
            }))
          )
        )
      )
    )
  );

  deleteEnquiry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.deleteEnquiry),
      mergeMap(({ id }) =>
        this.adminEnquiryService.deleteMessage(id).pipe(
          map(() => AdminActions.loadAdminEnquiries()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to delete enquiry.'
            }))
          )
        )
      )
    )
  );

  // Admin Notifications
  loadAdminNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminNotifications),
      switchMap(() =>
        this.notificationService.getAdminNotifications().pipe(
          map((response: any) => AdminActions.loadAdminNotificationsSuccess({
            notifications: response?.data || []
          })),
          catchError((error) =>
            of(AdminActions.loadAdminNotificationsFailure({
              error: error?.error?.message ?? 'Failed to load notifications.'
            }))
          )
        )
      )
    )
  );

  createAdminNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.createAdminNotification),
      mergeMap(({ data }) =>
        this.notificationService.createAdminNotification(data).pipe(
          map(() => AdminActions.loadAdminNotifications()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to create notification.'
            }))
          )
        )
      )
    )
  );

  deleteAdminNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.deleteAdminNotification),
      mergeMap(({ id }) =>
        this.notificationService.deleteAdminNotification(id).pipe(
          map(() => AdminActions.loadAdminNotifications()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.error?.message ?? 'Failed to delete notification.'
            }))
          )
        )
      )
    )
  );

  // Admin Profile
  loadAdminProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminProfile),
      switchMap(() =>
        this.adminService.getProfile().pipe(
          map((response) => AdminActions.loadAdminProfileSuccess({ profile: response.data })),
          catchError((error) =>
            of(AdminActions.loadAdminProfileFailure({
              error: error?.message ?? error?.error?.message ?? 'Failed to load admin profile.'
            }))
          )
        )
      )
    )
  );

  updateAdminProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.updateAdminProfile),
      mergeMap(({ data }) =>
        this.adminService.updateProfile(data).pipe(
          map(() => AdminActions.loadAdminProfile()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.message ?? error?.error?.message ?? 'Failed to update admin profile.'
            }))
          )
        )
      )
    )
  );

  uploadAdminProfileImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.uploadAdminProfileImage),
      mergeMap(({ file }) =>
        this.adminService.uploadProfileImage(file).pipe(
          map(() => AdminActions.loadAdminProfile()),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.message ?? error?.error?.message ?? 'Failed to upload profile image.'
            }))
          )
        )
      )
    )
  );

  changeAdminPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.changeAdminPassword),
      mergeMap(({ data }) =>
        this.adminService.changePassword(data).pipe(
          map((response) => AdminActions.adminActionSuccess({
            message: response?.message ?? 'Password changed successfully.'
          })),
          catchError((error) =>
            of(AdminActions.adminActionFailure({
              error: error?.message ?? error?.error?.message ?? 'Failed to change password.'
            }))
          )
        )
      )
    )
  );
}
