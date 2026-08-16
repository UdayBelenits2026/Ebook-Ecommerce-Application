import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.state';

export const selectAdminState = createFeatureSelector<AdminState>('admin');

export const selectDashboardStats = createSelector(
  selectAdminState,
  (state: AdminState) => state.dashboardStats
);

export const selectAdminBooks = createSelector(
  selectAdminState,
  (state: AdminState) => state.books
);

export const selectAdminUsers = createSelector(
  selectAdminState,
  (state: AdminState) => state.users
);

export const selectAdminOrders = createSelector(
  selectAdminState,
  (state: AdminState) => state.orders
);

export const selectAdminReviews = createSelector(
  selectAdminState,
  (state: AdminState) => state.reviews
);

export const selectAdminEnquiries = createSelector(
  selectAdminState,
  (state: AdminState) => state.enquiries
);

export const selectAdminNotifications = createSelector(
  selectAdminState,
  (state: AdminState) => state.notifications
);

export const selectAdminProfile = createSelector(
  selectAdminState,
  (state: AdminState) => state.adminProfile
);

export const selectSidebarOpen = createSelector(
  selectAdminState,
  (state: AdminState) => state.sidebarOpen
);

export const selectAdminLoading = createSelector(
  selectAdminState,
  (state: AdminState) => state.loading
);

export const selectAdminError = createSelector(
  selectAdminState,
  (state: AdminState) => state.error
);

export const selectAdminSuccessMessage = createSelector(
  selectAdminState,
  (state: AdminState) => state.successMessage
);
