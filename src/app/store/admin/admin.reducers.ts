import { createReducer, on } from '@ngrx/store';
import { initialAdminState } from './admin.state';
import * as AdminActions from './admin.actions';

export const adminReducer = createReducer(
  initialAdminState,

  // Dashboard
  on(AdminActions.loadDashboard, (state) => ({ ...state, loading: true, error: null })),
  on(AdminActions.loadDashboardSuccess, (state, { stats }) => ({
    ...state, loading: false, dashboardStats: stats, error: null
  })),
  on(AdminActions.loadDashboardFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Books
  on(AdminActions.loadAdminBooks, (state) => ({ ...state, loading: true, error: null })),
  on(AdminActions.loadAdminBooksSuccess, (state, { books }) => ({
    ...state, loading: false, books, error: null
  })),
  on(AdminActions.loadAdminBooksFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Users
  on(AdminActions.loadAdminUsers, (state) => ({ ...state, loading: true, error: null })),
  on(AdminActions.loadAdminUsersSuccess, (state, { users }) => ({
    ...state, loading: false, users, error: null
  })),
  on(AdminActions.loadAdminUsersFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Orders
  on(AdminActions.loadAdminOrders, (state) => ({ ...state, loading: true, error: null })),
  on(AdminActions.loadAdminOrdersSuccess, (state, { orders }) => ({
    ...state, loading: false, orders, error: null
  })),
  on(AdminActions.loadAdminOrdersFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Reviews
  on(AdminActions.loadAdminReviews, (state) => ({ ...state, loading: true, error: null })),
  on(AdminActions.loadAdminReviewsSuccess, (state, { reviews }) => ({
    ...state, loading: false, reviews, error: null
  })),
  on(AdminActions.loadAdminReviewsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Enquiries
  on(AdminActions.loadAdminEnquiries, (state) => ({ ...state, loading: true, error: null })),
  on(AdminActions.loadAdminEnquiriesSuccess, (state, { enquiries }) => ({
    ...state, loading: false, enquiries, error: null
  })),
  on(AdminActions.loadAdminEnquiriesFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Notifications
  on(AdminActions.loadAdminNotifications, (state) => ({ ...state, loading: true, error: null })),
  on(AdminActions.loadAdminNotificationsSuccess, (state, { notifications }) => ({
    ...state, loading: false, notifications, error: null
  })),
  on(AdminActions.loadAdminNotificationsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Admin Profile
  on(AdminActions.loadAdminProfile, (state) => ({ ...state, loading: true, error: null })),
  on(AdminActions.loadAdminProfileSuccess, (state, { profile }) => ({
    ...state, loading: false, adminProfile: profile, error: null
  })),
  on(AdminActions.loadAdminProfileFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Sidebar
  on(AdminActions.toggleSidebar, (state) => ({
    ...state, sidebarOpen: !state.sidebarOpen
  })),

  // Generic success/failure
  on(AdminActions.adminActionSuccess, (state, { message }) => ({
    ...state, loading: false, successMessage: message, error: null
  })),
  on(AdminActions.adminActionFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  on(AdminActions.clearAdminMessages, (state) => ({
    ...state, error: null, successMessage: null
  }))
);
