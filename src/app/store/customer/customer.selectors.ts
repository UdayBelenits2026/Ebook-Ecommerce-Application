import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerState } from './customer.state';

export const selectCustomerState = createFeatureSelector<CustomerState>('customer');

export const selectProfile = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.profile
);

export const selectAddresses = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.addresses
);

export const selectCustomerNotifications = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.notifications
);

export const selectCustomerReviews = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.reviews
);

export const selectCustomerLoading = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.loading
);

export const selectCustomerError = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.error
);

export const selectCustomerSuccessMessage = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.successMessage
);
