import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => !!state.token
);

export const selectUserRole = createSelector(
  selectAuthState,
  (state: AuthState) => state.user?.role
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => (role ? role.toUpperCase() === 'ADMIN' : false)
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
