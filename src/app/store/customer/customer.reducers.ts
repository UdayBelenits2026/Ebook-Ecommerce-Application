import { createReducer, on } from '@ngrx/store';
import { initialCustomerState } from './customer.state';
import * as CustomerActions from './customer.actions';

export const customerReducer = createReducer(
  initialCustomerState,
  // Profile
  on(CustomerActions.loadProfile, (state) => ({ ...state, loading: true, error: null })),
  on(CustomerActions.loadProfileSuccess, (state, { profile }) => ({
    ...state, loading: false, profile, error: null
  })),
  on(CustomerActions.loadProfileFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),
  on(CustomerActions.updateProfile, CustomerActions.uploadAvatar, (state) => ({
    ...state, loading: true, error: null
  })),
  on(CustomerActions.updateProfileSuccess, (state, { profile, message }) => ({
    ...state, loading: false, profile, successMessage: message, error: null
  })),
  on(CustomerActions.updateProfileFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Addresses
  on(CustomerActions.loadAddresses, (state) => ({ ...state, loading: true, error: null })),
  on(CustomerActions.loadAddressesSuccess, (state, { addresses }) => ({
    ...state, loading: false, addresses, error: null
  })),
  on(CustomerActions.loadAddressesFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Notifications
  on(CustomerActions.loadNotifications, (state) => ({ ...state, loading: true, error: null })),
  on(CustomerActions.loadNotificationsSuccess, (state, { notifications }) => ({
    ...state, loading: false, notifications, error: null
  })),
  on(CustomerActions.loadNotificationsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Reviews
  on(CustomerActions.loadCustomerReviews, (state) => ({ ...state, loading: true, error: null })),
  on(CustomerActions.loadCustomerReviewsSuccess, (state, { reviews }) => ({
    ...state, loading: false, reviews, error: null
  })),
  on(CustomerActions.loadCustomerReviewsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  // Settings
  on(CustomerActions.changePassword, (state) => ({
    ...state, loading: true, error: null, successMessage: null
  })),
  on(CustomerActions.changePasswordSuccess, (state, { message }) => ({
    ...state, loading: false, successMessage: message, error: null
  })),
  on(CustomerActions.changePasswordFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),

  on(CustomerActions.clearCustomerMessages, (state) => ({
    ...state, error: null, successMessage: null
  }))
);
