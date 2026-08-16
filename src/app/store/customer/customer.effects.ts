import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MyaccountService } from '../../services/myaccount-service';
import { AddressService } from '../../services/address-service';
import { NotificationService } from '../../services/notification-service';
import { ReviewService } from '../../services/review-service';
import { SettingsService } from '../../services/settings-service';
import * as CustomerActions from './customer.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class CustomerEffects {
  private actions$ = inject(Actions);
  private myaccountService = inject(MyaccountService);
  private addressService = inject(AddressService);
  private notificationService = inject(NotificationService);
  private reviewService = inject(ReviewService);
  private settingsService = inject(SettingsService);

  // Profile
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadProfile),
      switchMap(() =>
        this.myaccountService.getProfile().pipe(
          map((response) => CustomerActions.loadProfileSuccess({ profile: response.data })),
          catchError((error) =>
            of(CustomerActions.loadProfileFailure({
              error: error?.error?.message ?? 'Failed to load profile.'
            }))
          )
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateProfile),
      mergeMap(({ data }) =>
        this.myaccountService.updateProfile(data).pipe(
          map((response) => CustomerActions.updateProfileSuccess({
            profile: response.data,
            message: response.message ?? 'Profile updated successfully.'
          })),
          catchError((error) =>
            of(CustomerActions.updateProfileFailure({
              error: error?.error?.message ?? 'Failed to update profile.'
            }))
          )
        )
      )
    )
  );

  uploadAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.uploadAvatar),
      mergeMap(({ file }) =>
        this.myaccountService.uploadAvatar(file).pipe(
          map((response) => CustomerActions.updateProfileSuccess({
            profile: response.data,
            message: 'Avatar uploaded successfully.'
          })),
          catchError((error) =>
            of(CustomerActions.updateProfileFailure({
              error: error?.error?.message ?? 'Failed to upload avatar.'
            }))
          )
        )
      )
    )
  );

  // Addresses
  loadAddresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadAddresses),
      switchMap(() =>
        this.addressService.getAddresses().pipe(
          map((response) => CustomerActions.loadAddressesSuccess({ addresses: response.data || [] })),
          catchError((error) =>
            of(CustomerActions.loadAddressesFailure({
              error: error?.error?.message ?? 'Failed to load addresses.'
            }))
          )
        )
      )
    )
  );

  addAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.addAddress),
      mergeMap(({ address }) =>
        this.addressService.addAddress(address).pipe(
          map(() => CustomerActions.loadAddresses()),
          catchError((error) =>
            of(CustomerActions.loadAddressesFailure({
              error: error?.error?.message ?? 'Failed to add address.'
            }))
          )
        )
      )
    )
  );

  updateAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateAddress),
      mergeMap(({ id, address }) =>
        this.addressService.updateAddress(id, address).pipe(
          map(() => CustomerActions.loadAddresses()),
          catchError((error) =>
            of(CustomerActions.loadAddressesFailure({
              error: error?.error?.message ?? 'Failed to update address.'
            }))
          )
        )
      )
    )
  );

  deleteAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteAddress),
      mergeMap(({ id }) =>
        this.addressService.deleteAddress(id).pipe(
          map(() => CustomerActions.loadAddresses()),
          catchError((error) =>
            of(CustomerActions.loadAddressesFailure({
              error: error?.error?.message ?? 'Failed to delete address.'
            }))
          )
        )
      )
    )
  );

  // Notifications
  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadNotifications),
      switchMap(() =>
        this.notificationService.getUserNotifications().pipe(
          map((response: any) => CustomerActions.loadNotificationsSuccess({
            notifications: response?.data || []
          })),
          catchError((error) =>
            of(CustomerActions.loadNotificationsFailure({
              error: error?.error?.message ?? 'Failed to load notifications.'
            }))
          )
        )
      )
    )
  );

  markNotificationRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.markNotificationRead),
      mergeMap(({ notificationId }) =>
        this.notificationService.markUserNotificationRead(notificationId).pipe(
          map(() => CustomerActions.loadNotifications()),
          catchError((error) =>
            of(CustomerActions.loadNotificationsFailure({
              error: error?.error?.message ?? 'Failed to mark notification as read.'
            }))
          )
        )
      )
    )
  );

  deleteNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.deleteNotification),
      mergeMap(({ notificationId }) =>
        this.notificationService.deleteUserNotification(notificationId).pipe(
          map(() => CustomerActions.loadNotifications()),
          catchError((error) =>
            of(CustomerActions.loadNotificationsFailure({
              error: error?.error?.message ?? 'Failed to delete notification.'
            }))
          )
        )
      )
    )
  );

  // Reviews
  loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomerReviews),
      switchMap(({ bookId }) =>
        this.reviewService.getReviews(bookId).pipe(
          map((response) => CustomerActions.loadCustomerReviewsSuccess({
            reviews: response.data || []
          })),
          catchError((error) =>
            of(CustomerActions.loadCustomerReviewsFailure({
              error: error?.error?.message ?? 'Failed to load reviews.'
            }))
          )
        )
      )
    )
  );

  addReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.addReview),
      mergeMap(({ data }) =>
        this.reviewService.addReview(data).pipe(
          map((response) => CustomerActions.loadCustomerReviews({ bookId: data.book_id })),
          catchError((error) =>
            of(CustomerActions.loadCustomerReviewsFailure({
              error: error?.error?.message ?? 'Failed to add review.'
            }))
          )
        )
      )
    )
  );

  // Settings
  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.changePassword),
      mergeMap(({ data }) =>
        this.settingsService.changePassword(data).pipe(
          map((response) => CustomerActions.changePasswordSuccess({
            message: response?.message ?? 'Password changed successfully.'
          })),
          catchError((error) =>
            of(CustomerActions.changePasswordFailure({
              error: error?.error?.message ?? 'Failed to change password.'
            }))
          )
        )
      )
    )
  );
}
