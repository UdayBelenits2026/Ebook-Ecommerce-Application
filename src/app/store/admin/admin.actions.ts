import { createAction, props } from '@ngrx/store';

// Dashboard
export const loadDashboard = createAction('[Admin] Load Dashboard');
export const loadDashboardSuccess = createAction(
  '[Admin API] Load Dashboard Success',
  props<{ stats: any }>()
);
export const loadDashboardFailure = createAction(
  '[Admin API] Load Dashboard Failure',
  props<{ error: string }>()
);

// Admin Books
export const loadAdminBooks = createAction('[Admin] Load Books');
export const loadAdminBooksSuccess = createAction(
  '[Admin API] Load Books Success',
  props<{ books: any[] }>()
);
export const loadAdminBooksFailure = createAction(
  '[Admin API] Load Books Failure',
  props<{ error: string }>()
);
export const createAdminBook = createAction(
  '[Admin] Create Book',
  props<{ payload: any; coverImage?: File }>()
);
export const createAdminBookSuccess = createAction('[Admin API] Create Book Success');
export const updateAdminBook = createAction(
  '[Admin] Update Book',
  props<{ id: number; payload: any }>()
);
export const deleteAdminBook = createAction(
  '[Admin] Delete Book',
  props<{ id: number }>()
);

// Admin Users
export const loadAdminUsers = createAction('[Admin] Load Users');
export const loadAdminUsersSuccess = createAction(
  '[Admin API] Load Users Success',
  props<{ users: any[] }>()
);
export const loadAdminUsersFailure = createAction(
  '[Admin API] Load Users Failure',
  props<{ error: string }>()
);
export const updateUserStatus = createAction(
  '[Admin] Update User Status',
  props<{ id: number; status: any }>()
);
export const deleteAdminUser = createAction(
  '[Admin] Delete User',
  props<{ id: number }>()
);

// Admin Orders
export const loadAdminOrders = createAction('[Admin] Load Orders');
export const loadAdminOrdersSuccess = createAction(
  '[Admin API] Load Orders Success',
  props<{ orders: any[] }>()
);
export const loadAdminOrdersFailure = createAction(
  '[Admin API] Load Orders Failure',
  props<{ error: string }>()
);
export const updateOrderStatus = createAction(
  '[Admin] Update Order Status',
  props<{ id: number; body: any }>()
);
export const updateOrderTracking = createAction(
  '[Admin] Update Order Tracking',
  props<{ id: number; body: any }>()
);

// Admin Reviews
export const loadAdminReviews = createAction('[Admin] Load Reviews');
export const loadAdminReviewsSuccess = createAction(
  '[Admin API] Load Reviews Success',
  props<{ reviews: any[] }>()
);
export const loadAdminReviewsFailure = createAction(
  '[Admin API] Load Reviews Failure',
  props<{ error: string }>()
);
export const deleteAdminReview = createAction(
  '[Admin] Delete Review',
  props<{ id: number }>()
);

// Admin Enquiries
export const loadAdminEnquiries = createAction('[Admin] Load Enquiries');
export const loadAdminEnquiriesSuccess = createAction(
  '[Admin API] Load Enquiries Success',
  props<{ enquiries: any[] }>()
);
export const loadAdminEnquiriesFailure = createAction(
  '[Admin API] Load Enquiries Failure',
  props<{ error: string }>()
);
export const markEnquiryRead = createAction(
  '[Admin] Mark Enquiry Read',
  props<{ id: number }>()
);
export const deleteEnquiry = createAction(
  '[Admin] Delete Enquiry',
  props<{ id: number }>()
);

// Admin Notifications
export const loadAdminNotifications = createAction('[Admin] Load Notifications');
export const loadAdminNotificationsSuccess = createAction(
  '[Admin API] Load Notifications Success',
  props<{ notifications: any[] }>()
);
export const loadAdminNotificationsFailure = createAction(
  '[Admin API] Load Notifications Failure',
  props<{ error: string }>()
);
export const createAdminNotification = createAction(
  '[Admin] Create Notification',
  props<{ data: any }>()
);
export const deleteAdminNotification = createAction(
  '[Admin] Delete Notification',
  props<{ id: number }>()
);

// Admin Profile
export const loadAdminProfile = createAction('[Admin] Load Profile');
export const loadAdminProfileSuccess = createAction(
  '[Admin API] Load Profile Success',
  props<{ profile: any }>()
);
export const loadAdminProfileFailure = createAction(
  '[Admin API] Load Profile Failure',
  props<{ error: string }>()
);
export const updateAdminProfile = createAction(
  '[Admin] Update Profile',
  props<{ data: any }>()
);
export const uploadAdminProfileImage = createAction(
  '[Admin] Upload Profile Image',
  props<{ file: File }>()
);
export const changeAdminPassword = createAction(
  '[Admin] Change Password',
  props<{ data: any }>()
);

// Sidebar
export const toggleSidebar = createAction('[Admin] Toggle Sidebar');

// Generic success/failure for mutations
export const adminActionSuccess = createAction(
  '[Admin API] Action Success',
  props<{ message: string }>()
);
export const adminActionFailure = createAction(
  '[Admin API] Action Failure',
  props<{ error: string }>()
);

export const clearAdminMessages = createAction('[Admin] Clear Messages');
