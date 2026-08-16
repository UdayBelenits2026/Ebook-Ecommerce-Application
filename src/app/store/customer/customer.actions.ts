import { createAction, props } from '@ngrx/store';

// Profile
export const loadProfile = createAction('[Customer] Load Profile');
export const loadProfileSuccess = createAction(
  '[Customer API] Load Profile Success',
  props<{ profile: any }>()
);
export const loadProfileFailure = createAction(
  '[Customer API] Load Profile Failure',
  props<{ error: string }>()
);
export const updateProfile = createAction(
  '[Customer] Update Profile',
  props<{ data: any }>()
);
export const updateProfileSuccess = createAction(
  '[Customer API] Update Profile Success',
  props<{ profile: any; message: string }>()
);
export const updateProfileFailure = createAction(
  '[Customer API] Update Profile Failure',
  props<{ error: string }>()
);
export const uploadAvatar = createAction(
  '[Customer] Upload Avatar',
  props<{ file: File }>()
);

// Addresses
export const loadAddresses = createAction('[Customer] Load Addresses');
export const loadAddressesSuccess = createAction(
  '[Customer API] Load Addresses Success',
  props<{ addresses: any[] }>()
);
export const loadAddressesFailure = createAction(
  '[Customer API] Load Addresses Failure',
  props<{ error: string }>()
);
export const addAddress = createAction(
  '[Customer] Add Address',
  props<{ address: any }>()
);
export const updateAddress = createAction(
  '[Customer] Update Address',
  props<{ id: number; address: any }>()
);
export const deleteAddress = createAction(
  '[Customer] Delete Address',
  props<{ id: number }>()
);

// Notifications
export const loadNotifications = createAction('[Customer] Load Notifications');
export const loadNotificationsSuccess = createAction(
  '[Customer API] Load Notifications Success',
  props<{ notifications: any[] }>()
);
export const loadNotificationsFailure = createAction(
  '[Customer API] Load Notifications Failure',
  props<{ error: string }>()
);
export const markNotificationRead = createAction(
  '[Customer] Mark Notification Read',
  props<{ notificationId: number }>()
);
export const deleteNotification = createAction(
  '[Customer] Delete Notification',
  props<{ notificationId: number }>()
);

// Reviews
export const loadCustomerReviews = createAction(
  '[Customer] Load Reviews',
  props<{ bookId: number }>()
);
export const loadCustomerReviewsSuccess = createAction(
  '[Customer API] Load Reviews Success',
  props<{ reviews: any[] }>()
);
export const loadCustomerReviewsFailure = createAction(
  '[Customer API] Load Reviews Failure',
  props<{ error: string }>()
);
export const addReview = createAction(
  '[Customer] Add Review',
  props<{ data: any }>()
);

// Settings
export const changePassword = createAction(
  '[Customer] Change Password',
  props<{ data: any }>()
);
export const changePasswordSuccess = createAction(
  '[Customer API] Change Password Success',
  props<{ message: string }>()
);
export const changePasswordFailure = createAction(
  '[Customer API] Change Password Failure',
  props<{ error: string }>()
);

export const clearCustomerMessages = createAction('[Customer] Clear Messages');
