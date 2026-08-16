import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { response }) => {
    const data = response.data || response;
    return {
      ...state,
      token: data.access_token,
      tokenType: data.token_type || 'bearer',
      user: {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        role: data.role,
      },
      loading: false,
      error: null,
    };
  }),
  on(AuthActions.signupSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
 on(
  AuthActions.loginFailure,
  AuthActions.signupFailure,
  (state, { error }) => {
    console.log('🔴 REDUCER RECEIVED FAILURE');
    console.log('🔴 ERROR:', error);
    console.log('🔴 OLD LOADING:', state.loading);

    return {
      ...state,
      loading: false,
      error,
    };
  },
),
  on(AuthActions.logout, (state) => ({
    ...state,
    token: null,
    tokenType: null,
    user: {
      id: null,
      full_name: null,
      email: null,
      role: null,
    },
    loading: false,
    error: null,
  })),
  on(AuthActions.updateAuthUser, (state, { user }) => ({
    ...state,
    user: {
      ...state.user,
      ...user,
    },
  })),
);
